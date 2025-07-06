import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"


type Props = {
  index: number;
  diameter: number;
  deletable?: boolean;
  onDiameterChange: (value: number) => void;
  handleRemoveCircle?: () => void;
};

const CircleParameters = ({
  index,
  diameter,
  deletable = false,
  onDiameterChange,
  handleRemoveCircle,
}: Props) => {
  return (
    <div>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <Label htmlFor={`circle-diameter-${index}`}>
            Circle {index} Diameter
          </Label>
          {deletable && handleRemoveCircle && (
            <span
              className="text-red-600 pr-4.5 hover:cursor-pointer hover:text-red-900"
              onClick={handleRemoveCircle}
            >
              x
            </span>
          )}
        </div>
        <Input
          type="number"
          id={`circle-diameter-${index}`}
          min={20}
          value={diameter}
          onChange={e => onDiameterChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default CircleParameters