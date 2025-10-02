import { NextResponse } from 'next/server';

// Mock database (replace with real database later)
let users: any[] = [
    {
        id: '1',
        email: 'test@example.com',
        password: 'password',
        username: 'Test User'
    }
];

export async function POST(request: Request) {
    try {
        const { email, password, username } = await request.json();

        // Validate input
        if (!email || !password || !username) {
            return NextResponse.json(
                { message: 'Email, password, and username are required' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return NextResponse.json(
                { message: 'User already exists with this email' },
                { status: 409 }
            );
        }

        // Create new user (in real app, hash password and save to database)
        const newUser = {
            id: (users.length + 1).toString(),
            email,
            password, // In real app: await bcrypt.hash(password, 12)
            username
        };

        users.push(newUser);

        // Return user data without password
        const { password: _, ...userWithoutPassword } = newUser;

        return NextResponse.json(userWithoutPassword, { status: 201 });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}