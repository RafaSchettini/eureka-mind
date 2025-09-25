import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Clock, Target } from "lucide-react";

interface ProgressCardProps {
  title: string;
  value: number;
  target?: number;
  timeSpent?: string;
  trend?: number;
  icon?: React.ReactNode;
}

export function ProgressCard({ 
  title, 
  value, 
  target, 
  timeSpent, 
  trend,
  icon 
}: ProgressCardProps) {
  const percentage = target ? (value / target) * 100 : value;
  
  return (
    <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              {value}
            </span>
            {target && (
              <span className="text-sm text-muted-foreground">
                / {target}
              </span>
            )}
          </div>
          
          <Progress 
            value={Math.min(percentage, 100)} 
            className="h-2"
          />
          
          <div className="flex items-center justify-between text-sm">
            {timeSpent && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{timeSpent}</span>
              </div>
            )}
            
            {trend && (
              <div className={`flex items-center gap-1 ${trend > 0 ? 'text-success' : 'text-destructive'}`}>
                <TrendingUp className="w-3 h-3" />
                <span>{trend > 0 ? '+' : ''}{trend}%</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}