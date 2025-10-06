import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CircleParametersProps {
  index: number;
  diameter: number;
  count: number;
  color: string;
  deletable?: boolean;
  onDiameterChange: (newDiameter: number) => void;
  onCountChange: (newCount: number) => void;
  onColorChange: (newColor: string) => void;
  handleRemoveCircle?: () => void;
}

export default function CircleParameters({
  index,
  diameter,
  count,
  color,
  deletable = false,
  onDiameterChange,
  onCountChange,
  onColorChange,
  handleRemoveCircle
}: CircleParametersProps) {
  return (
    <div className="flex flex-col gap-3 p-4 border rounded-lg bg-muted/30">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">Circle {index}</Label>
        {deletable && handleRemoveCircle && (
          <Button
            variant="destructive"
            size="icon"
            onClick={handleRemoveCircle}
            className="h-7 w-7"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Diameter input */}
        <div className="space-y-1">
          <Label htmlFor={`circle-diameter-${index}`} className="text-xs text-muted-foreground">
            Diameter (px)
          </Label>
          <Input
            type="number"
            id={`circle-diameter-${index}`}
            min={10}
            max={200}
            value={diameter}
            onChange={(e) => onDiameterChange(Number(e.target.value))}
            placeholder="Diameter"
            className="h-9"
          />
        </div>

        {/* Count input */}
        <div className="space-y-1">
          <Label htmlFor={`circle-count-${index}`} className="text-xs text-muted-foreground">
            Quantity
          </Label>
          <Input
            type="number"
            id={`circle-count-${index}`}
            min={1}
            max={50}
            value={count}
            onChange={(e) => onCountChange(Number(e.target.value))}
            placeholder="Count"
            className="h-9"
          />
        </div>
      </div>

      {/* Color picker */}
      <div className="space-y-1">
        <Label htmlFor={`circle-color-${index}`} className="text-xs text-muted-foreground">
          Color
        </Label>
        <div className="flex gap-2">
          <Input
            type="color"
            id={`circle-color-${index}`}
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            className="h-9 w-16 cursor-pointer"
          />
          <Input
            type="text"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            placeholder="#000000"
            className="h-9 flex-1 font-mono text-sm"
          />
        </div>
      </div>
    </div>
  );
}