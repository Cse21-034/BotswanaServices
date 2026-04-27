import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Diagnostic endpoint to check business categories
 * GET /api/admin/check-categories
 */
export async function GET() {
    try {
        // Get all businesses with their categories
        const businesses = await prisma.business.findMany({
            select: {
                id: true,
                name: true,
                branchName: true,
                isBranch: true,
                status: true,
                verified: true,
                categoryId: true,
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Count by status and verified
        const publishedCount = businesses.filter(b => b.status === 'PUBLISHED').length;
        const verifiedCount = businesses.filter(b => b.verified).length;
        const withCategoryCount = businesses.filter(b => b.categoryId).length;
        const publishedAndVerified = businesses.filter(b => b.status === 'PUBLISHED' && b.verified).length;

        // Get category counts
        const categoryGroups: { [key: string]: number } = {};
        businesses.forEach(b => {
            if (b.status === 'PUBLISHED' && b.verified && b.category) {
                categoryGroups[b.category.name] = (categoryGroups[b.category.name] || 0) + 1;
            }
        });

        return NextResponse.json({
            success: true,
            summary: {
                total: businesses.length,
                published: publishedCount,
                verified: verifiedCount,
                withCategory: withCategoryCount,
                publishedAndVerified,
            },
            categoryGroups,
            businesses: businesses.map(b => ({
                name: b.name,
                branchName: b.branchName,
                isBranch: b.isBranch,
                status: b.status,
                verified: b.verified,
                categoryId: b.categoryId,
                categoryName: b.category?.name || 'NO CATEGORY'
            }))
        });

    } catch (error) {
        console.error('Check categories error:', error);
        return NextResponse.json(
            { error: "Failed to check categories" },
            { status: 500 }
        );
    }
}
