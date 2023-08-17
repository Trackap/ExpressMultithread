export default function test(header: string) {
    return function (req: any, res: any, next: any) {
        res.set("X-Example-Header", header);
        next();
    }
}