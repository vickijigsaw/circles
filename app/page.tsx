"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import CircleParameters from "@/components/circle/CircleParameters";
import CircleGenerator from "@/components/circle/CircleGenerator";
import { useSession } from "next-auth/react";
import { PlacedCircle } from "@/components/utils/circleUtils";
import { downloadSVG } from "@/components/utils/downloadUtils";
import { toast } from "sonner";

type CircleObject = {
  diameter: number;
  count: number;
  color: string;
  index: number;
};

export default function Home() {
  // State for circles - starts with empty array
  const [circleObjects, setCircleObjects] = useState<CircleObject[]>([]);

  // State for first circle (index 1)
  const [firstCircleDiameter, setFirstCircleDiameter] = useState<number>(50);
  const [firstCircleCount, setFirstCircleCount] = useState<number>(10);
  const [firstCircleColor, setFirstCircleColor] = useState<string>("#000000");

  // State for canvas dimensions - with initial values
  const [canvasWidth, setCanvasWidth] = useState<number>(1000);
  const [canvasHeight, setCanvasHeight] = useState<number>(500);

  // State for applied dimensions (those used in the current generation)
  const [appliedWidth, setAppliedWidth] = useState<number>(1000);
  const [appliedHeight, setAppliedHeight] = useState<number>(500);

  // State for placed circles (actual positions)
  const [placedCircles, setPlacedCircles] = useState<PlacedCircle[]>([]);

  // Auth
  const { data: session } = useSession();

  // Function to add a new circle
  const handleAddCircle = () => {
    const newCircle: CircleObject = {
      diameter: 30,
      count: 15,
      color: "#000000",
      index: circleObjects.length + 2, // +2 because first circle is index 1
    };
    setCircleObjects(prev => [...prev, newCircle]);
  };

  // Function to remove a circle
  const handleRemoveCircle = (indexToRemove: number) => {
    setCircleObjects(prev =>
      prev
        .filter(circle => circle.index !== indexToRemove)
        .map(circle =>
          circle.index > indexToRemove
            ? { ...circle, index: circle.index - 1 }
            : circle
        )
    );
  };

  // Function to update a circle's diameter
  const handleUpdateDiameter = (indexToUpdate: number, newDiameter: number) => {
    if (indexToUpdate === 1) {
      setFirstCircleDiameter(newDiameter);
    } else {
      setCircleObjects(prev =>
        prev.map(circle =>
          circle.index === indexToUpdate
            ? { ...circle, diameter: newDiameter }
            : circle
        )
      );
    }
  };

  // Function to update a circle's count
  const handleUpdateCount = (indexToUpdate: number, newCount: number) => {
    if (indexToUpdate === 1) {
      setFirstCircleCount(newCount);
    } else {
      setCircleObjects(prev =>
        prev.map(circle =>
          circle.index === indexToUpdate
            ? { ...circle, count: newCount }
            : circle
        )
      );
    }
  };

  // Function to update a circle's color
  const handleUpdateColor = (indexToUpdate: number, newColor: string) => {
    if (indexToUpdate === 1) {
      setFirstCircleColor(newColor);
    } else {
      setCircleObjects(prev =>
        prev.map(circle =>
          circle.index === indexToUpdate
            ? { ...circle, color: newColor }
            : circle
        )
      );
    }
  };

  // Function to save pattern to gallery
  const handleSavePattern = async () => {
    if (!session?.user) {
      toast.error("Please log in to save patterns!");
      return;
    }

    if (placedCircles.length === 0) {
      toast.error("Please generate a pattern first!");
      return;
    }

    const promise = async () => {
      const now = new Date();
      const name = `Pattern_${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;

      const patternData = {
        name,
        canvasWidth: appliedWidth,
        canvasHeight: appliedHeight,
        circles: [
          { diameter: firstCircleDiameter, count: firstCircleCount, color: firstCircleColor, index: 1 },
          ...circleObjects
        ],
        placedCircles // Include the actual placed circles
      };

      const response = await fetch('/api/patterns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patternData),
      });

      if (!response.ok) {
        throw new Error("Failed to save pattern");
      }

      const data = await response.json();
      return data;
    };

    toast.promise(promise, {
      loading: 'Saving pattern to gallery...',
      success: (data) => `Pattern "${data.pattern.name}" saved successfully!`,
      error: 'Failed to save pattern.',
    });
  };

  // Function to Download as SVG
  const handleExportSVG = () => {
    const patternData = {
      name: "CurrentPattern",
      canvasWidth: appliedWidth,
      canvasHeight: appliedHeight,
      placedCircles,
    };

    downloadSVG({ patternData });
  };


  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Header with greeting */}
      <header className="w-full py-8 px-8 border-b">
        <h1 className="text-4xl font-bold text-center">
          👋 Hello, I'm a Circle Pattern Generator
        </h1>
        <p className="text-center text-muted-foreground mt-2">
          Create beautiful geometric patterns with custom parameters
        </p>
      </header>

      {/* Main content */}
      <main className="flex-1 w-full px-8 py-8">
        <div className="flex gap-6 items-start flex-col md:flex-row">
          {/* Left side - Parameters Card */}
          <Card className="w-full md:flex-1">
            <CardHeader>
              <CardTitle>Parameters</CardTitle>
              <CardDescription>Create Your Dream Pattern!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Canvas dimensions section */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="canvasWidth">Canvas Width (px)</Label>
                  <Input
                    type="number"
                    id="canvasWidth"
                    max={2000}
                    value={canvasWidth || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCanvasWidth(val === "" ? 0 : Math.max(0, Number(val)));
                    }}
                    placeholder="Enter canvas width"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="canvasHeight">Canvas Height (px)</Label>
                  <Input
                    type="number"
                    id="canvasHeight"
                    max={2000}
                    value={canvasHeight || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCanvasHeight(val === "" ? 0 : Math.max(0, Number(val)));
                    }}
                    placeholder="Enter canvas height"
                  />
                </div>
              </div>

              {/* Circle parameters section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Circle Types</h3>

                {/* First circle - cannot be deleted */}
                <CircleParameters
                  index={1}
                  diameter={firstCircleDiameter}
                  count={firstCircleCount}
                  color={firstCircleColor}
                  onDiameterChange={newVal => handleUpdateDiameter(1, newVal)}
                  onCountChange={newVal => handleUpdateCount(1, newVal)}
                  onColorChange={newVal => handleUpdateColor(1, newVal)}
                />

                {/* Additional circles - can be deleted */}
                {circleObjects.map(circle => (
                  <CircleParameters
                    key={circle.index}
                    index={circle.index}
                    diameter={circle.diameter}
                    count={circle.count}
                    color={circle.color}
                    deletable
                    onDiameterChange={newVal => handleUpdateDiameter(circle.index, newVal)}
                    onCountChange={newVal => handleUpdateCount(circle.index, newVal)}
                    onColorChange={newVal => handleUpdateColor(circle.index, newVal)}
                    handleRemoveCircle={() => handleRemoveCircle(circle.index)}
                  />
                ))}
              </div>

              {/* Add circle button */}
              <Button
                variant="outline"
                onClick={handleAddCircle}
                className="w-full"
                disabled={circleObjects.length >= 4}
              >
                + Add a Circle Type
              </Button>
              {circleObjects.length >= 4 && (
                <p className="text-xs text-muted-foreground text-center">
                  Maximum 5 circle types reached
                </p>
              )}

              {/* Action buttons for saving and exporting */}
              <div className="space-y-2 pt-4 border-t">
                <Button
                  onClick={handleSavePattern}
                  className="w-full"
                  variant="default"
                >
                  💾 Save to Gallery
                </Button>
                <Button
                  onClick={handleExportSVG}
                  className="w-full"
                  variant="secondary"
                >
                  📥 Download as SVG
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Right side - Pattern Generator Display */}
          <div className="flex-1">
            <CircleGenerator
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
              circles={[
                { diameter: firstCircleDiameter, count: firstCircleCount, color: firstCircleColor, index: 1 },
                ...circleObjects
              ]}
              onPlacedCirclesChange={(placed, w, h) => {
                setPlacedCircles(placed);
                setAppliedWidth(w);
                setAppliedHeight(h);
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}