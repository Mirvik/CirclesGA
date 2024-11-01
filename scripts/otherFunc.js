
export function getWindowProperty() {

    const width = window.innerWidth;
    const height = window.innerHeight;

    return {
        'width': width,
        'height': height
    }

}

export function getInitialCoords(windowProperty) {

    const x = window.innerWidth / 2;
    const y = window.innerHeight - 50;

    return {
        'x': x,
        'y': y
    }
}