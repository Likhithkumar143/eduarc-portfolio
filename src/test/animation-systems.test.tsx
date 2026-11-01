import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProgressiveImage } from "@/components/site/ProgressiveImage";
import { PaperPlaneButton } from "@/components/site/PaperPlaneButton";

describe("Animation and Interaction Systems", () => {
  describe("ProgressiveImage (Blur-up LQIP)", () => {
    it("renders image with initial progressive-img-loading blur class", () => {
      const { container } = render(
        <ProgressiveImage
          src="/test-photo.jpg"
          alt="Test campus session"
          width={400}
          height={300}
        />,
      );

      const img = screen.getByRole("img");
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", "/test-photo.jpg");
      expect(img).toHaveClass("progressive-img-loading");

      // Verify LQIP placeholder shimmer is present
      const shimmer = container.querySelector(".animate-pulse");
      expect(shimmer).toBeInTheDocument();
    });

    it("transitions to progressive-img-loaded and removes blur on load", () => {
      const onLoad = vi.fn();
      render(
        <ProgressiveImage
          src="/test-photo.jpg"
          alt="Test campus session"
          onLoad={onLoad}
        />,
      );

      const img = screen.getByRole("img");
      fireEvent.load(img);

      expect(img).toHaveClass("progressive-img-loaded");
      expect(img).not.toHaveClass("progressive-img-loading");
      expect(onLoad).toHaveBeenCalledOnce();
    });

    it("renders accessible error fallback when image fails to load", () => {
      render(
        <ProgressiveImage
          src="/broken-image.jpg"
          alt="Broken campus banner"
        />,
      );

      const img = screen.getByRole("img");
      fireEvent.error(img);

      expect(screen.getByText("Broken campus banner")).toBeInTheDocument();
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });
  });

  describe("PaperPlaneButton (Form Submission Feedback)", () => {
    it("renders idle state with default action label and send icon", () => {
      render(
        <PaperPlaneButton
          idleText="Submit Guidance Request"
          isSubmitting={false}
          isSuccess={false}
        />,
      );

      expect(screen.getByRole("button")).toHaveTextContent("Submit Guidance Request");
      expect(screen.getByRole("button")).not.toBeDisabled();
      expect(screen.queryByText(/submitted successfully/i)).not.toBeInTheDocument();
    });

    it("renders spinner and disables button during backend submission", () => {
      render(
        <PaperPlaneButton
          isSubmitting={true}
          submittingText="Submitting Enquiry…"
          isSuccess={false}
        />,
      );

      const btn = screen.getByRole("button");
      expect(btn).toBeDisabled();
      expect(btn).toHaveTextContent("Submitting Enquiry…");
    });

    it("renders paper plane flight animation and checkmark on confirmed success", () => {
      const { container } = render(
        <PaperPlaneButton
          isSubmitting={false}
          isSuccess={true}
          successText="Submitted Successfully"
        />,
      );

      const btn = screen.getByRole("button");
      expect(btn).toBeDisabled();
      expect(btn).toHaveTextContent("Submitted Successfully");

      // Verify paper plane SVG container with animate-paper-plane class
      const flyingPlane = container.querySelector(".animate-paper-plane");
      expect(flyingPlane).toBeInTheDocument();
    });

    it("does not render paper plane flight when submission fails or is rejected", () => {
      const { container } = render(
        <PaperPlaneButton
          isSubmitting={false}
          isSuccess={false}
          idleText="Retry Submission"
        />,
      );

      const flyingPlane = container.querySelector(".animate-paper-plane");
      expect(flyingPlane).toBeNull();
      expect(screen.getByRole("button")).toHaveTextContent("Retry Submission");
      expect(screen.getByRole("button")).not.toBeDisabled();
    });
  });
});

