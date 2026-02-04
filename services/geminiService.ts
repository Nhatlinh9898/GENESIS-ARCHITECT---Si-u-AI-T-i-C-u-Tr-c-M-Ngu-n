import { GoogleGenAI, Type, Modality } from "@google/genai";
import { AppType, TechStack, Architecture, GeneratedResult, FileNode } from '../types';

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key not found in environment variables");
    return new GoogleGenAI({ apiKey });
};

export const generateArchitecture = async (
    libraryPath: string,
    appType: AppType,
    stack: TechStack,
    architecture: Architecture,
    requirements: string,
    context: string
): Promise<GeneratedResult> => {
    const ai = getClient();
    
    const systemPrompt = `
    Bạn là Thien Master AI - Kiến trúc sư phần mềm tối thượng chuyên tái sử dụng code (Code Reuse Specialist).
    Nhiệm vụ: Phân tích yêu cầu người dùng và giả lập việc quét một thư viện code tại đường dẫn "${libraryPath}".
    
    Hãy đóng vai trò phân tích các snippet giả định có trong thư viện đó (ví dụ: auth_utils, date_helper, db_connection, ui_buttons...) và lắp ghép chúng thành một ứng dụng mới.
    
    Ngôn ngữ trả về: Tiếng Việt 100%.
    
    Yêu cầu đầu ra JSON bao gồm:
    1. analysis: Phân tích sâu sắc về yêu cầu và chiến lược tái sử dụng (Tối đa 200 từ).
    2. reusedSnippets: Danh sách tên các file/module bạn đã "tìm thấy" và tái sử dụng.
    3. fileTree: Cấu trúc thư mục dự án mới.
    4. documentation: Hướng dẫn chạy và giải thích kiến trúc (Ngắn gọn).
    5. diagramData: Dữ liệu để vẽ biểu đồ thống kê.

    QUAN TRỌNG - CRITICAL INSTRUCTION:
    - JSON response giới hạn token rất nghiêm ngặt.
    - Trong 'fileTree', chỉ viết nội dung 'content' thực sự cho 2 file quan trọng nhất (như Main App hoặc Core Logic).
    - TẤT CẢ các file còn lại: 'content' chỉ được chứa comment mô tả chức năng (VD: "// Logic xử lý auth ở đây..."), KHÔNG viết code chi tiết.
    - Giới hạn tối đa 10 dòng code cho mỗi file.
    - Tuyệt đối không bao gồm SVG path, base64 ảnh, hoặc dữ liệu text dài.
    `;

    const userPrompt = `
    DỰ ÁN: ${appType}
    CÔNG NGHỆ: ${stack}
    KIẾN TRÚC: ${architecture}
    YÊU CẦU CHI TIẾT: ${requirements}
    BỐI CẢNH: ${context}
    
    Output JSON only. Ensure valid JSON.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: userPrompt,
        config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    analysis: { type: Type.STRING },
                    reusedSnippets: { type: Type.ARRAY, items: { type: Type.STRING } },
                    documentation: { type: Type.STRING },
                    diagramData: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                value: { type: Type.NUMBER }
                            }
                        }
                    },
                    fileTree: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                type: { type: Type.STRING, enum: ['file', 'folder'] },
                                content: { type: Type.STRING },
                                description: { type: Type.STRING },
                                isReused: { type: Type.BOOLEAN },
                                children: { 
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT, 
                                        properties: {
                                            name: { type: Type.STRING },
                                            type: { type: Type.STRING },
                                            content: { type: Type.STRING },
                                            description: { type: Type.STRING },
                                            isReused: { type: Type.BOOLEAN }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!response.text) throw new Error("No response from AI");
    
    // Robust Parsing Logic
    try {
        return JSON.parse(response.text) as GeneratedResult;
    } catch (e) {
        console.warn("First parse attempt failed. Trying cleanup.", e);
        try {
            // Remove markdown code fences if present
            let cleanText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
            // Attempt to repair truncated JSON (primitive method: close brackets)
            // This is a heuristic: if it ends with "...", try to remove it and close objects.
            // But usually just parsing the clean text works if the model obeyed the prompt.
            return JSON.parse(cleanText) as GeneratedResult;
        } catch (e2) {
             console.error("JSON Parse Critical Error", e2);
             console.log("Raw Response Snippet:", response.text.slice(-100));
             throw new Error("Dữ liệu trả về bị lỗi cấu trúc (JSON Error). Hãy thử lại với yêu cầu ngắn gọn hơn.");
        }
    }
};

export const generateVoiceSpeech = async (text: string, voice: 'Nam_ChuyenGia' | 'Nu_TruyenCam', speed: number): Promise<string> => {
    const ai = getClient();
    const voiceName = voice === 'Nam_ChuyenGia' ? 'Kore' : 'Fenrir'; 

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: voiceName },
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) throw new Error("No audio data returned");
        return base64Audio;
    } catch (error) {
        console.error("TTS Error", error);
        throw error;
    }
};