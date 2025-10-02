import { NextResponse } from 'next/server';

export async function POST() {
    try {
        // In a real app, you would clear the session cookie here
        // Example with cookies:
        // const response = NextResponse.json({ message: 'Logged out successfully' });
        // response.cookies.set('session', '', { expires: new Date(0) });
        // return response;

        return NextResponse.json({ message: 'Logged out successfully' });

    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}