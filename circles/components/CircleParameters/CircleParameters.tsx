import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"

const CircleParameters = ({ index }: { index: number }) => {
    return (
        <div>
            <div className="flex flex-col gap-1">
                <Label htmlFor="CircleDiameter">Circle {index} Diameter</Label>
                <Input type="number" id="CircleDiameter" min={20} placeholder="Enter circle diameter"></Input>
            </div>
        </div>
    );
}

export default CircleParameters;