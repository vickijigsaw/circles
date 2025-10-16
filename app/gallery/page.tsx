"use client";

import { use, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Grid3x3, List, Trash2, Download } from "lucide-react";

// Type for saved patterns
type SavedPattern = {
    id: string;
    name: string;
    canvasWidth: number;
    canvasHeight: number;
    circles: { diameter: number; index: number }[];
    createdAt: string;
    thumbnail: string; // Base64 or URL to pattern preview
};

export default function Gallery() {
    // Mock user data (to come from auth later)
    const [username, setUsername] = useState<string>("Alex");

    // View mode: 'grid' or 'list'
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Mock saved patterns (to come from backend later)
    const [savedPatterns, setSavedPatterns] = useState<SavedPattern[]>([
        {
            id: "1",
            name: "Design 01",
            canvasWidth: 800,
            canvasHeight: 600,
            circles: [
                { diameter: 50, index: 1 },
                { diameter: 30, index: 2 },
                { diameter: 40, index: 3 }
            ],
            createdAt: "2025-10-01",
            thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect width='600' height='400' fill='%23f8f9fa'/%3E%3Ccircle cx='80' cy='80' r='30' fill='%23FF6B6B' opacity='0.7'/%3E%3Ccircle cx='180' cy='80' r='10' fill='%234ECDC4' opacity='0.7'/%3E%3C/svg%3E"
        },
        {
            id: "2",
            name: "Design 02",
            canvasWidth: 600,
            canvasHeight: 400,
            circles: [
                { diameter: 60, index: 1 },
                { diameter: 20, index: 2 }
            ],
            createdAt: "2024-10-02",
            thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect width='600' height='400' fill='%23f8f9fa'/%3E%3Ccircle cx='80' cy='80' r='30' fill='%23FF6B6B' opacity='0.7'/%3E%3Ccircle cx='180' cy='80' r='10' fill='%234ECDC4' opacity='0.7'/%3E%3C/svg%3E"
        },
        {
            id: "3",
            name: "Design 03",
            canvasWidth: 1000,
            canvasHeight: 800,
            circles: [
                { diameter: 45, index: 1 },
                { diameter: 35, index: 2 },
                { diameter: 25, index: 3 },
                { diameter: 15, index: 4 }
            ],
            createdAt: "2024-10-02",
            thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1000' height='800'%3E%3Crect width='1000' height='800' fill='%23f8f9fa'/%3E%3Ccircle cx='70' cy='70' r='22' fill='%23FF6B6B' opacity='0.7'/%3E%3Ccircle cx='150' cy='70' r='17' fill='%234ECDC4' opacity='0.7'/%3E%3Ccircle cx='230' cy='70' r='12' fill='%2345B7D1' opacity='0.7'/%3E%3C/svg%3E"
        }
    ]);

    // Delete pattern handler
    const handleDeletePattern = (id: string) => {
        if (confirm("Are you sure you want to delete this pattern?")) {
            setSavedPatterns(prev => prev.filter(pattern => pattern.id !== id));
            // TODO: API call to delete from backend
            console.log("Deleting pattern:", id);
        }
    };

    // Download pattern handler
    const handleDownLoadPattern = (pattern: SavedPattern) => {
        console.log("Downloading pattern:", pattern.name);
        alert('Downloading ${pattern.name}...');
        // TODO: Implement actual SVG download
    };

    return (
        <div className="min-h-screen w-full flex flex-col">
            {/* Header with greeting */}
            <header className="w-full py-8 px-8 border-b bg-gradient-to-r from-primary/5 to-primary/10">
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
                                        <img
                                            src={pattern.thumbnail}
                                            alt={pattern.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <CardHeader>
                                        <CardTitle className="text-lg">{pattern.name}</CardTitle>
                                        <CardDescription>
                                            {pattern.canvasWidth} × {pattern.canvasHeight}px • {pattern.circles.length} circles
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                                            <span>Created: {pattern.createdAt}</span>
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
                                            <img
                                                src={pattern.thumbnail}
                                                alt={pattern.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Pattern info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-xl font-semibold mb-1">{pattern.name}</h3>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {pattern.canvasWidth} × {pattern.canvasHeight}px • {pattern.circles.length} circles
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Created: {pattern.createdAt}
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
