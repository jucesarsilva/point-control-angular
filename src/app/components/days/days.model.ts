export class Point {
  codDay: Number;
  codPoint: Number;
  time: string;
  userTime: Object
}
export class DaysResponse {
  codDay: Number;
  codUser: Number;
  date: string;
  points: Array<Point>;
}
