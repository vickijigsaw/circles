import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// GET - Fetch user's patterns
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        console.log("Session:", session);
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const patterns = await prisma.pattern.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ patterns });
    } catch (error) {
        console.error("Error fetching patterns:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST - Save a new pattern
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const { name, canvasWidth, canvasHeight, circles } = await request.json();

        const pattern = await prisma.pattern.create({
            data: {
                name,
                canvasWidth,
                canvasHeight,
                circles,
                userId: user.id
            }
        });

        return NextResponse.json({
            message: "Pattern saved successfully",
            pattern
        });
    } catch (error) {
        console.error("Error saving pattern:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE - Delete a pattern (using query parameter)
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Get pattern ID from query parameters
        const { searchParams } = new URL(request.url);
        const patternId = searchParams.get('id');

        if (!patternId) {
            return NextResponse.json(
                { error: "Pattern ID is required" },
                { status: 400 }
            );
        }

        // Check if pattern belongs to user
        const pattern = await prisma.pattern.findFirst({
            where: {
                id: patternId,
                userId: user.id
            }
        });

        if (!pattern) {
            return NextResponse.json(
                { error: "Pattern not found or unauthorized" },
                { status: 404 }
            );
        }

        await prisma.pattern.delete({
            where: { id: patternId }
        });

        return NextResponse.json({
            message: "Pattern deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting pattern:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}