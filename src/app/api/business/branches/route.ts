import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { geocodeWithFallback } from "@/utils/geocoding";
import { canAddBranch } from "@/lib/subscription-access";

// GET /api/business/branches - List all branches for authenticated business owner
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Get user with their businesses
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                businesses: {
                    include: {
                        branches: {
                            include: {
                                businessHours: true,
                                photos: true,
                                reviews: true,
                            }
                        },
                        parentBusiness: true,
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Get all parent businesses (non-branches)
        const parentBusinesses = user.businesses.filter(b => !b.isBranch);

        return NextResponse.json({
            success: true,
            businesses: parentBusinesses,
        });

    } catch (error) {
        console.error("Error fetching branches:", error);
        return NextResponse.json(
            { error: "Unable to fetch branches" },
            { status: 500 }
        );
    }
}

// POST /api/business/branches - Add a new branch
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const {
            parentBusinessId,
            branchName,
            email,
            phone,
            address,
            city,
            region,
            latitude,
            longitude,
        } = body;

        // Validate required fields - ADDRESS IS NOW REQUIRED
        if (!parentBusinessId || !branchName || !city || !address) {
            return NextResponse.json(
                { error: "Parent business ID, branch name, city, and address are required for branch creation" },
                { status: 400 }
            );
        }

        // Validate that address is not empty
        if (address.trim() === '') {
            return NextResponse.json(
                { error: "Branch address cannot be empty. Please provide a specific address for this branch location." },
                { status: 400 }
            );
        }

        // Get user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { businesses: true }
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Verify user owns the parent business and include photos
        const parentBusiness = await prisma.business.findUnique({
            where: { id: parentBusinessId },
            include: {
                photos: true  // Include parent's photos to copy them
            }
        });

        if (!parentBusiness || parentBusiness.ownerId !== user.id) {
            return NextResponse.json(
                { error: "You don't have permission to add branches to this business" },
                { status: 403 }
            );
        }

        // Check branch limit against subscription plan
        const branchCheck = await canAddBranch(parentBusinessId);
        if (!branchCheck.allowed) {
            return NextResponse.json({
                error: branchCheck.reason,
                upgradeRequired: true,
                limit: branchCheck.limit,
                current: branchCheck.current,
            }, { status: 403 });
        }

        // Check if branch name already exists for this parent
        const existingBranch = await prisma.business.findFirst({
            where: {
                parentBusinessId,
                branchName: {
                    equals: branchName,
                    mode: 'insensitive'
                }
            }
        });

        if (existingBranch) {
            return NextResponse.json(
                { error: "A branch with this name already exists" },
                { status: 409 }
            );
        }

        // Generate slug
        const slug = `${parentBusiness.name}-${branchName}`
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        // Geocode the branch address
        const coords = await geocodeWithFallback(address, city);
        console.log(`📍 Geocoded branch ${branchName} to:`, coords);

        // Create branch - inherit parent data but require unique address
        const branch = await prisma.business.create({
            data: {
                // Inherited from parent
                name: parentBusiness.name,
                description: parentBusiness.description,
                logo: parentBusiness.logo,
                coverImage: parentBusiness.coverImage,
                website: parentBusiness.website,
                categoryId: parentBusiness.categoryId,
                subCategoryId: parentBusiness.subCategoryId,
                services: parentBusiness.services,
                establishedYear: parentBusiness.establishedYear,
                employees: parentBusiness.employees,
                pricingRange: parentBusiness.pricingRange,
                country: parentBusiness.country,

                // Branch-specific details - ADDRESS IS REQUIRED AND UNIQUE
                slug: `${slug}-${Date.now()}`,
                email: email || parentBusiness.email,
                phone: phone || parentBusiness.phone,
                address: address.trim(),  // Use the provided address (required)
                city,
                region: region || '',
                latitude: coords.latitude,
                longitude: coords.longitude,

                // Branch metadata
                ownerId: user.id,
                isBranch: true,
                branchName,
                parentBusinessId,

                // Auto-publish if parent is published, otherwise pending
                status: parentBusiness.status === 'PUBLISHED' ? 'PUBLISHED' : 'PENDING',
                verified: parentBusiness.verified,
            },
        });

        // Copy parent's photos to the branch
        if (parentBusiness.photos && parentBusiness.photos.length > 0) {
            await prisma.businessPhoto.createMany({
                data: parentBusiness.photos.map(photo => ({
                    url: photo.url,
                    businessId: branch.id,
                    isPrimary: photo.isPrimary,
                    caption: photo.caption || undefined
                }))
            });
        }

        return NextResponse.json({
            success: true,
            message: "Branch created successfully with parent's photos",
            branch,
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating branch:", error);
        return NextResponse.json(
            { error: "Unable to create branch" },
            { status: 500 }
        );
    }
}
