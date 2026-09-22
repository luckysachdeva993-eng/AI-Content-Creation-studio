function createPrompt(type, idea) {

    if (type === "text") {

        return `
Create professional and engaging written content about:

${idea}

Requirements:
- Use clear and simple language.
- Organize the content logically.
- Keep the content relevant to the topic.
- Make it suitable for the intended audience.
- Maintain a professional and engaging tone.
`;

    }

    else if (type === "image") {

        return `
Create a detailed professional AI image prompt for:

${idea}

Include:
- Main subject
- Environment and background
- Lighting
- Composition
- Camera angle
- Visual style
- Mood and atmosphere
- Level of realism
- High-quality visual details
`;

    }

    else if (type === "poster") {

        return `
Create a professional promotional poster prompt for:

${idea}

Include:
- Main headline
- Supporting text
- Main visual elements
- Layout and composition
- Typography
- Color theme
- Background
- Relevant icons or graphics
- Professional design style
- Target audience
`;

    }

    else if (type === "video") {

        return `
Create a detailed cinematic AI video prompt for:

${idea}

Include:
- Scene description
- Subject movement
- Environment
- Camera movement
- Camera angle
- Lighting
- Atmosphere
- Visual style
- Duration or pacing
- Cinematic details
`;

    }

    else if (type === "song") {

        return `
Create a detailed AI music generation prompt for:

${idea}

Include:
- Song theme
- Genre
- Mood
- Vocal style
- Instruments
- Tempo
- Rhythm
- Musical atmosphere
- Overall emotional feeling
`;

    }

    else {

        return "Please select a valid content type.";

    }
}

module.exports = createPrompt;