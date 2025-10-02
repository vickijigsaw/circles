import { NextResponse } from 'next/server';

// Mock user data (replace with session validation later)
const users = [
    {
        id: '1',
        email: 'test@example.com',
        username: 'Test User'
    }
];

export async function GET() {
    try {
        // In a real app, you would:
        // 1. Check the session cookie
        // 2. Validate the session
        // 3. Return the user data from the database

        // For now, we'll return the first user as mock data
        // This means the app will think you're always logged in with the test user
        const user = users[0];

        if (!user) {
            return NextResponse.json({ user: null });
        }

        return NextResponse.json(user);

    } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json({ user: null });
    }
}