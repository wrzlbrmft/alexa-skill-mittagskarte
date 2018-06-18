export class Menu {
    private name: string = undefined;

    public constructor(name: string) {
        this.setName(name);
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }
}
