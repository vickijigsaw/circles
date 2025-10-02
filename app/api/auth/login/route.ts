import { NextResponse } from 'next/server';

// Mock user database (replace with real database later)
const users = [
    {
        id: '1',
        email: 'test@example.com',
        password: 'password', // In real app, use hashed passwords
        username: 'Test User'
    }
];

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Find user (in real app, check database)
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            return NextResponse.json(
                { message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Return user data without password
        const { password: _, ...userWithoutPassword } = user;

        // In a real app, you would set a session cookie here
        return NextResponse.json(userWithoutPassword);

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}