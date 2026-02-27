import { NextResponse } from "next/server";
import { stat } from "fs/promises";
import { join } from "path";
import { createReadStream } from "fs";

export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
    const { path: pathArray } = await params;

    try {
        const filePath = join(process.cwd(), "public", "uploads", ...pathArray);
        const stats = await stat(filePath);

        if (!stats.isFile()) {
            return new NextResponse("Not Found", { status: 404 });
        }

        const range = request.headers.get("range");

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;

            if (start >= stats.size || end >= stats.size) {
                return new NextResponse("Requested Range Not Satisfiable", {
                    status: 416,
                    headers: {
                        "Content-Range": `bytes */${stats.size}`,
                    },
                });
            }

            const chunksize = end - start + 1;
            const fileStream = createReadStream(filePath, { start, end });

            // Using any here as a workaround for Node.js readable streams in Next.js response
            const stream = new ReadableStream({
                start(controller) {
                    fileStream.on("data", (chunk) => controller.enqueue(chunk));
                    fileStream.on("end", () => controller.close());
                    fileStream.on("error", (err) => controller.error(err));
                },
                cancel() {
                    fileStream.destroy();
                },
            });

            return new NextResponse(stream, {
                status: 206,
                headers: {
                    "Content-Range": `bytes ${start}-${end}/${stats.size}`,
                    "Accept-Ranges": "bytes",
                    "Content-Length": chunksize.toString(),
                    "Content-Type": getContentType(filePath),
                },
            });
        }

        // Full file request
        const fileStream = createReadStream(filePath);
        const stream = new ReadableStream({
            start(controller) {
                fileStream.on("data", (chunk) => controller.enqueue(chunk));
                fileStream.on("end", () => controller.close());
                fileStream.on("error", (err) => controller.error(err));
            },
            cancel() {
                fileStream.destroy();
            },
        });

        return new NextResponse(stream, {
            status: 200,
            headers: {
                "Accept-Ranges": "bytes",
                "Content-Length": stats.size.toString(),
                "Content-Type": getContentType(filePath),
            },
        });
    } catch (e: unknown) {
        if (typeof e === 'object' && e !== null && 'code' in e && (e as { code?: string }).code === "ENOENT") {
            return new NextResponse("Not Found", { status: 404 });
        }
        console.error("Error serving static file:", e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

function getContentType(filePath: string) {
    const ext = filePath.split(".").pop()?.toLowerCase() || "";
    const mimeTypes: Record<string, string> = {
        mp3: "audio/mpeg",
        wav: "audio/wav",
        ogg: "audio/ogg",
        m4a: "audio/mp4",
        mp4: "video/mp4",
        webm: "video/webm",
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        gif: "image/gif",
        svg: "image/svg+xml",
        pdf: "application/pdf",
    };
    return mimeTypes[ext] || "application/octet-stream";
}
