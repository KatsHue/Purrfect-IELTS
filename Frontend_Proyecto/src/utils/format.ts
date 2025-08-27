export const formatResponse = (text: string) => {
    const lines = text.split("\n");

    const sections: [string, string][] = [];
    let currentTitle = "";
    let currentContent: string[] = [];

    for (let line of lines) {
        // Si es fin de bloque ("|")
        if (line.trim() === "|") {
        if (currentTitle || currentContent.length > 0) {
            sections.push([currentTitle, currentContent.join("\n").trim()]);
        }
        currentTitle = "";
        currentContent = [];
        }
        // Si es un título tipo ***Title***
        else if (/^\*{3}(.+)\*{3}$/.test(line.trim())) {
        currentTitle = line.trim().replace(/^\*{3}(.+)\*{3}$/, "$1");
        }
        // Si no, acumular como contenido
        else {
        currentContent.push(line);
        }
    }

    // último bloque (por si no termina con "|")
    if (currentTitle || currentContent.length > 0) {
        sections.push([currentTitle, currentContent.join("\n").trim()]);
    }

    return sections;
}