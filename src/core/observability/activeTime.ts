// Approximation of foreground engagement, not attention or cognitive effort.
export const IDLE_MS = 60_000;
export class ActiveTime {
 private total=0; private last:number; private engaged:number;
 private blocked=new Set<string>();
 constructor(now:number){this.last=now;this.engaged=now;}
 read(now:number){
  const end=Math.max(this.last,now);
  if(!this.blocked.size)this.total+=Math.max(0,Math.min(end,this.engaged+IDLE_MS)-this.last);
  this.last=end;return Math.round(this.total);
 }
 touch(now:number){this.read(now);this.engaged=now;}
 block(reason:string,value:boolean,now:number){this.read(now);if(value)this.blocked.add(reason);else {this.blocked.delete(reason);this.engaged=now;}}
}
