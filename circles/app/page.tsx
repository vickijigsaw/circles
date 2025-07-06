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
      index: circleObjects.length + 2,
    };
    setCircleObjects([...circleObjects, newCircle]);
  };

  return (
    <div className="w-screen flex flex-col ">
      <main className="w-screen px-8">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Parameters</CardTitle>
            <CardDescription>
              Create Your Dream Pattern!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <Label htmlFor="canvasWidth">Canvas Width</Label>
                <Input type="number" id="canvasWidth" min={100} placeholder="Enter canvas width"></Input>
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="canvasHeight">Canvas Height</Label>
                <Input type="number" id="canvasHeight" min={100} placeholder="Enter canvas height"></Input>
              </div>
            </div>
            <div className="flex flex-col gap-4 py-4">
              <CircleParameters index={1}></CircleParameters>
              {circleObjects.map((circle) => (
                <CircleParameters key={circle.index} index={circle.index} />
              ))}
            </div>
            <Button variant="outline" onClick={handleAddCircle}>+ Add a Circle</Button>
          </CardContent>
        </Card>

      </main>

    </div>
  );
}
