import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// PUT /api/business/branches/[branchId] - Update branch details
export async function PUT(
    req: Request,
    { params }: { params: { branchId: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { branchId } = params;
        const body = await req.json();

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

        // Verify user owns this branch
        const branch = user.businesses.find(b => b.id === branchId);
        if (!branch) {
            return NextResponse.json(
                { error: "You don't have permission to update this branch" },
                { status: 403 }
            );
        }

        // Update branch
        const updatedBranch = await prisma.business.update({
            where: { id: branchId },
            data: {
                branchName: body.branchName || branch.branchName,
                email: body.email || branch.email,
                phone: body.phone || branch.phone,
                address: body.address !== undefined ? body.address : branch.address,
                city: body.city || branch.city,
                region: body.region !== undefined ? body.region : branch.region,
                latitude: body.latitude !== undefined ? body.latitude : branch.latitude,
                longitude: body.longitude !== undefined ? body.longitude : branch.longitude,
                description: body.description !== undefined ? body.description : branch.description,
                website: body.website !== undefined ? body.website : branch.website,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Branch updated successfully",
            branch: updatedBranch,
        });

    } catch (error) {
        console.error("Error updating branch:", error);
        return NextResponse.json(
            { error: "Unable to update branch" },
            { status: 500 }
        );
    }
}

// DELETE /api/business/branches/[branchId] - Delete a branch
export async function DELETE(
    req: Request,
    { params }: { params: { branchId: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { branchId } = params;

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

        // Verify user owns this branch
        const branch = user.businesses.find(b => b.id === branchId);
        if (!branch || !branch.isBranch) {
            return NextResponse.json(
                { error: "You don't have permission to delete this branch" },
                { status: 403 }
            );
        }

        // Delete branch
        await prisma.business.delete({
            where: { id: branchId },
        });

        return NextResponse.json({
            success: true,
            message: "Branch deleted successfully",
        });

    } catch (error) {
        console.error("Error deleting branch:", error);
        return NextResponse.json(
            { error: "Unable to delete branch" },
            { status: 500 }
        );
    }
}
