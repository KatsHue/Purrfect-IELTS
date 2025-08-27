import axios from "axios";

const headers = {
    authorization: "11ef32d699aa449dbd317f052299be88",
    "Content-Type": "application/json",
}

export const transcriptionAI = async (audioBlob: Blob) => {
    try {
        // 1. Subir el audio
        const uploadResponse = await axios.post(
        "https://api.assemblyai.com/v2/upload",
        audioBlob,
        {
            headers: {
            authorization: "11ef32d699aa449dbd317f052299be88",
            "Content-Type": "application/octet-stream",
            },
        }
        );

        const audioUrl = uploadResponse.data.upload_url;
        console.log("✅ Audio subido, URL:", audioUrl);

        // 2. Crear transcripción
        const transcriptResponse = await axios.post(
        "https://api.assemblyai.com/v2/transcript",
        { audio_url: audioUrl },
        { headers }
        );

        const transcriptId = transcriptResponse.data.id;
        console.log("📝 Transcript creado, ID:", transcriptId);

        // 3. Hacer polling hasta que termine
        let status = "queued";
        let transcriptText = "";

        while (status !== "completed" && status !== "error") {
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const pollingResponse = await axios.get(
            `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
            { headers }
        );

        status = pollingResponse.data.status;
        console.log("⏳ Status:", status);

        if (status === "completed") {
            transcriptText = pollingResponse.data.text;
        } else if (status === "error") {
            throw new Error(pollingResponse.data.error);
        }
        }

        console.log("✅ Transcripción lista:", transcriptText);
        return transcriptText;

    } catch (err: any) {
        console.error("❌ Error en transcriptionAI:", err.response?.data || err);
        throw err;
    }

} 