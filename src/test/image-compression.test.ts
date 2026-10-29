import { describe, it, expect, vi } from "vitest";
import {
  formatBytes,
  getBase64ByteSize,
  supportsWebPExport,
  compressImage,
} from "@/lib/image-compression";

describe("Image Compression Utility", () => {
  describe("formatBytes", () => {
    it("formats 0 bytes correctly", () => {
      expect(formatBytes(0)).toBe("0 B");
      expect(formatBytes(-10)).toBe("0 B");
    });

    it("formats bytes under 1KB", () => {
      expect(formatBytes(512)).toBe("512 B");
    });

    it("formats kilobytes", () => {
      expect(formatBytes(1024)).toBe("1.0 KB");
      expect(formatBytes(153600)).toBe("150.0 KB");
    });

    it("formats megabytes", () => {
      expect(formatBytes(1048576)).toBe("1.00 MB");
      expect(formatBytes(5242880)).toBe("5.00 MB");
    });
  });

  describe("getBase64ByteSize", () => {
    it("calculates correct byte size for standard base64 data URLs", () => {
      // 100 base64 characters ~ 75 bytes
      const testString = "data:image/jpeg;base64," + "A".repeat(100);
      expect(getBase64ByteSize(testString)).toBe(75);
    });

    it("returns 0 for invalid data URLs", () => {
      expect(getBase64ByteSize("invalid-string")).toBe(0);
    });
  });

  describe("supportsWebPExport", () => {
    it("returns boolean without throwing in jsdom environment", () => {
      const supported = supportsWebPExport();
      expect(typeof supported).toBe("boolean");
    });
  });

  describe("compressImage validations", () => {
    it("rejects non-image files with clear error message", async () => {
      const textFile = new File(["test content"], "document.txt", { type: "text/plain" });
      await expect(compressImage(textFile)).rejects.toThrow(
        "Please select a valid image file (JPEG, PNG, WEBP, or AVIF)."
      );
    });

    it("rejects oversized input files exceeding max limit", async () => {
      const largeFile = new File(["test"], "huge.jpg", { type: "image/jpeg" });
      Object.defineProperty(largeFile, "size", { value: 20 * 1024 * 1024 });

      await expect(compressImage(largeFile, { maxInputSizeMb: 15 })).rejects.toThrow(
        /exceeds the 15MB maximum limit/
      );
    });
  });
});
