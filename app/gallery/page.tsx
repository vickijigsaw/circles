"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Grid3x3, List, Trash2, Download } from "lucide-react";
import { useSession } from "next-auth/react";
import ThumbnailPreview from "@/components/circle/ThumbnailPreview";
import { PlacedCircle } from "@/components/utils/circleUtils";

// Type for saved patterns
export type SavedPattern = {
    id: string;
    name: string;
    canvasWidth: number;
    canvasHeight: number;
    circles: any[];
    placedCircles?: PlacedCircle[];
    createdAt: string;
    updatedAt: string;
};

export default function Gallery() {
    const { data: session, status } = useSession();
    const username = session?.user?.name || "User";

    // View mode: 'grid' or 'list'
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [savedPatterns, setSavedPatterns] = useState<SavedPattern[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>("");

    // Fetch patterns on mount and when session changes
    useEffect(() => {
        if (status === "loading") return; // Wait for session to load

        if (session?.user) {
            fetchPatterns();
        } else {
            setIsLoading(false);
        }
    }, [session, status]);

    const fetchPatterns = async () => {
        try {
            setIsLoading(true);
            setError("");

            const response = await fetch('/api/patterns');

            if (!response.ok) {
                throw new Error('Failed to fetch patterns');
            }

            const data = await response.json();
            setSavedPatterns(data.patterns || []);
        } catch (error: any) {
            console.error("Error fetching patterns:", error);
            setError(error.message || "Failed to load patterns");
        } finally {
            setIsLoading(false);
        }
    };

    // Delete pattern handler
    const handleDeletePattern = async (id: string) => {
        if (!confirm("Are you sure you want to delete this pattern?")) {
            return;
        }

        try {
            const response = await fetch(`/api/patterns?id=${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete pattern');
            }

            // Remove pattern from local state
            setSavedPatterns(prev => prev.filter(pattern => pattern.id !== id));
        } catch (error: any) {
            console.error("Error deleting pattern:", error);
            alert(`Failed to delete pattern: ${error.message}`);
        }
    };

    // Download pattern handler (placeholder)
    const handleDownLoadPattern = (pattern: SavedPattern) => {
        console.log("Downloading pattern:", pattern.name);
        alert(`Downloading ${pattern.name}... (feature coming soon)`);
        // TODO: Implement actual SVG download
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };


    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen w-full flex flex-col">
                <header className="w-full text-center py-8 px-8 border-b bg-gradient-to-r from-primary/5 to-primary/10">
                    <h1 className="text-4xl font-bold">👋 Hello, {username}!</h1>
                    <p className="text-muted-foreground mt-2 text-lg">Welcome back to your creative space!</p>
                </header>
                <main className="flex-1 w-full px-8 py-8 flex items-center justify-center">
                    <p className="text-muted-foreground">Loading your patterns...</p>
                </main>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen w-full flex flex-col">
                <header className="w-full text-center py-8 px-8 border-b bg-gradient-to-r from-primary/5 to-primary/10">
                    <h1 className="text-4xl font-bold">👋 Hello, {username}!</h1>
                    <p className="text-muted-foreground mt-2 text-lg">Welcome back to your creative space!</p>
                </header>
                <main className="flex-1 w-full px-8 py-8 flex items-center justify-center">
                    <Card className="p-6 text-center">
                        <p className="text-red-600 mb-4">Error: {error}</p>
                        <Button onClick={fetchPatterns}>Try Again</Button>
                    </Card>
                </main>
            </div>
        );
    }

    // Show login prompt if not authenticated
    if (!session?.user) {
        return (
            <div className="min-h-screen w-full flex flex-col">
                <header className="w-full text-center py-8 px-8 border-b bg-gradient-to-r from-primary/5 to-primary/10">
                    <h1 className="text-4xl font-bold">👋 Hello!</h1>
                    <p className="text-muted-foreground mt-2 text-lg">Please log in to view your gallery</p>
                </header>
                <main className="flex-1 w-full px-8 py-8 flex items-center justify-center">
                    <Card className="p-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="text-6xl">🔒</div>
                            <h3 className="text-xl font-semibold">Login Required</h3>
                            <p className="text-muted-foreground">Please log in to view your saved patterns</p>
                            <Button asChild>
                                <a href="/login">Log In</a>
                            </Button>
                        </div>
                    </Card>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex flex-col">
            {/* Header with greeting */}
            <header className="w-full text-center py-8 px-8 border-b bg-gradient-to-r from-primary/5 to-primary/10">
                <h1 className="text-4xl font-bold">
                    👋 Hello, {username}!
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                    Welcome back to your creative space!
                </p>
            </header>

            {/* Gallery section */}
            <main className="flex-1 w-full px-8 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Gallery header with view toggle */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-3xl font-bold">Gallery</h2>
                            <p className="text-muted-foreground mt-1">
                                This is the gallery of your custom patterns
                            </p>
                        </div>

                        {/* View mode toggle */}
                        <div className="flex gap-2">
                            <Button
                                variant={viewMode === 'grid' ? 'default' : 'outline'}
                                size="icon"
                                onClick={() => setViewMode('grid')}
                                title="Grid view"
                            >
                                <Grid3x3 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'default' : 'outline'}
                                size="icon"
                                onClick={() => setViewMode('list')}
                                title="List view"
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Empty state */}
                    {savedPatterns.length === 0 && (
                        <Card className="p-12 text-center">
                            <div className="flex flex-col items-center gap-4">
                                <div className="text-6xl">🎨</div>
                                <h3 className="text-xl font-semibold">No patterns yet</h3>
                                <p className="text-muted-foreground">
                                    Create your first pattern in the Generator to see it here!
                                </p>
                                <Button asChild>
                                    <a href="/">Go to Generator</a>
                                </Button>
                            </div>
                        </Card>
                    )}

                    {/* Grid view */}
                    {viewMode === 'grid' && savedPatterns.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {savedPatterns.map(pattern => (
                                <Card key={pattern.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                    {/* Pattern preview */}
                                    <div className="aspect-video bg-muted relative overflow-hidden">
                                        <ThumbnailPreview pattern={pattern} />
                                    </div>

                                    <CardHeader>
                                        <CardTitle className="text-lg">{pattern.name}</CardTitle>
                                        <CardDescription>
                                            {pattern.canvasWidth} × {pattern.canvasHeight}px • {pattern.circles.length} circle types
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                                            <span>Created: {formatDate(pattern.createdAt)}</span>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                className="flex-1"
                                                onClick={() => handleDownLoadPattern(pattern)}
                                            >
                                                <Download className="h-4 w-4 mr-2" />
                                                Download
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => handleDeletePattern(pattern.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* List view */}
                    {viewMode === 'list' && savedPatterns.length > 0 && (
                        <div className="space-y-4">
                            {savedPatterns.map(pattern => (
                                <Card key={pattern.id} className="hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-6 p-6">
                                        {/* Thumbnail */}
                                        <div className="w-32 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                                            <ThumbnailPreview pattern={pattern} />
                                        </div>

                                        {/* Pattern info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-xl font-semibold mb-1">{pattern.name}</h3>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {pattern.canvasWidth} × {pattern.canvasHeight}px • {pattern.circles.length} circle types
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Created: {formatDate(pattern.createdAt)}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 flex-shrink-0">
                                            <Button
                                                variant="outline"
                                                onClick={() => handleDownLoadPattern(pattern)}
                                            >
                                                <Download className="h-4 w-4 mr-2" />
                                                Download
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => handleDeletePattern(pattern.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}