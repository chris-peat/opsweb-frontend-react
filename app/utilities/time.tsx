// A set of utility functions for date and time manipulation

export function toStringNoSeconds(d: Date) {
    return d.toISOString().replace("T", " ").substring(0, 16);
}