import React from "react";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useSubjects } from "@/hooks/use-subjects";

type SubjectSelectorProps = {
  selectedSubjectId: number | null;
  onSubjectChange: (subjectId: number) => void;
  disabled?: boolean;
};

const SubjectSelector: React.FC<SubjectSelectorProps> = ({ 
  selectedSubjectId, 
  onSubjectChange,
  disabled = false
}) => {
  const { subjects, isLoading } = useSubjects();
  
  return (
    <div className="mb-5">
      <Label htmlFor="subject" className="block text-sm font-medium text-slate-400 mb-2">
        Matéria em estudo
      </Label>
      <div className="relative">
        <Select 
          value={selectedSubjectId?.toString() || ""}
          onValueChange={(value) => onSubjectChange(parseInt(value))}
          disabled={disabled || isLoading}
        >
          <SelectTrigger 
            id="subject"
            className="w-full h-12 px-4 py-2 rounded-lg bg-slate-700 border-0 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500 focus:outline-none"
          >
            <SelectValue placeholder="Selecione a matéria" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-white">
            <SelectGroup>
              {subjects.map((subject) => (
                <SelectItem 
                  key={subject.id} 
                  value={subject.id.toString()}
                  className="focus:bg-slate-700 focus:text-white"
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: subject.color }}
                    />
                    <span>{subject.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SubjectSelector;
