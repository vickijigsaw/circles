"use client";

import CircleParameters from "@/components/CircleParameters/CircleParameters";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Image from "next/image";
import { useState } from "react";

type CircleObject = {
  diameter: number,
  index: number,
}

export default function Home() {
  const [circleObjects, setCircleObjects] = useState<CircleObject[]>([]);

  const handleAddCircle = () => {
    const newCircle: CircleObject = {
      diameter: 20,
      index: circleObjects.length + 2, // +2 to start from index=2
    };
    setCircleObjects(prev => [...prev, newCircle]);
  };

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

  const handleUpdateDiameter = (indexToUpdate: number, newDiameter: number) => {
    setCircleObjects(prev =>
      prev.map(circle =>
        circle.index === indexToUpdate
          ? { ...circle, diameter: newDiameter }
          : circle
      )
    );
  };

  return (
    <div className="w-screen flex flex-col">
      <main className="w-screen px-8">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Parameters</CardTitle>
            <CardDescription>Create Your Dream Pattern!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <Label htmlFor="canvasWidth">Canvas Width</Label>
                <Input type="number" id="canvasWidth" min={100} placeholder="Enter canvas width" />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="canvasHeight">Canvas Height</Label>
                <Input type="number" id="canvasHeight" min={100} placeholder="Enter canvas height" />
              </div>
            </div>

            <div className="flex flex-col gap-4 py-4">
              <CircleParameters index={1} diameter={20} onDiameterChange={newVal => handleUpdateDiameter(1, newVal)} />

              {circleObjects.map(circle => (
                <CircleParameters
                  key={circle.index}
                  index={circle.index}
                  diameter={circle.diameter}
                  deletable
                  onDiameterChange={newVal => handleUpdateDiameter(circle.index, newVal)}
                  handleRemoveCircle={() => handleRemoveCircle(circle.index)}
                />
              ))}
            </div>

            <Button variant="outline" onClick={handleAddCircle}>
              + Add a Circle
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}