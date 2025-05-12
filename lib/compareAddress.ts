export function cmpAddr(address1: string | null = "", address2: string | null = ""): boolean {
    return address1?.toLowerCase() === address2?.toLowerCase();
}