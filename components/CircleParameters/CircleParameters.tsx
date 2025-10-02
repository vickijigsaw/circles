import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CircleParametersProps {
  index: number;
  diameter: number;
  deletable?: boolean;
  onDiameterChange: (newDiameter: number) => void;
  handleRemoveCircle?: () => void;
}

export default function CircleParameters({
  index,
  diameter,
  deletable = false,
  onDiameterChange,
  handleRemoveCircle
}: CircleParametersProps) {
  return (
    <div className="flex items-end gap-2 p-3 border rounded-lg bg-muted/30">
      <div className="flex-1 space-y-2">
        <Label htmlFor={`circle-${index}`} className="text-xs">
          Circle {index} Diameter (px)
        </Label>
        <Input
          type="number"
          id={`circle-${index}`}
          min={10}
          max={200}
          value={diameter}
          onChange={(e) => onDiameterChange(Number(e.target.value))}
          placeholder="Diameter"
          className="text-base"
        />
      </div>

      {deletable && handleRemoveCircle && (
        <Button
          variant="destructive"
          size="icon"
          onClick={handleRemoveCircle}
          className="flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}