import type { Ref } from "vue";
import { debounce } from "lodash-es";

const DEFAULT_CONFIG = {
  defense: true,
  color: "#c0c4cc",
  opacity: 0.5,
  size: 16,
  family: "serif",
  angle: -20,
  width: 300,
  height: 200,
};

type DefaultConfig = typeof DEFAULT_CONFIG;

interface Observer {
  watermarkElMutationObserver?: MutationObserver;
  parentElMutationObserver?: MutationObserver;
  parentElResizeObserver?: ResizeObserver;
}

const bodyEl = ref<HTMLElement>(document.body);

export function useWatermark(parentEl: Ref<HTMLElement | null> = bodyEl) {
  let backupText: string;
  let mergeConfig: DefaultConfig;
  let watermarkEl: HTMLElement | null = null;
  const observer: Observer = {
    watermarkElMutationObserver: undefined,
    parentElMutationObserver: undefined,
    parentElResizeObserver: undefined,
  };

  const setWatermark = (text: string, config: Partial<DefaultConfig> = {}) => {
    if (!parentEl.value)
      return console.warn(
        "请在 DOM 挂载完成后再调用 setWatermark 方法设置水印",
      );
    backupText = text;
    mergeConfig = { ...DEFAULT_CONFIG, ...config };
    watermarkEl ? updateWatermarkEl() : createWatermarkEl();
    addElListener(parentEl.value);
  };

  const createWatermarkEl = () => {
    const isBody =
      parentEl.value!.tagName.toLowerCase() ===
      bodyEl.value.tagName.toLowerCase();
    const watermarkElPosition = isBody ? "fixed" : "absolute";
    const parentElPosition = isBody ? "" : "relative";
    watermarkEl = document.createElement("div");
    watermarkEl.style.pointerEvents = "none";
    watermarkEl.style.top = "0";
    watermarkEl.style.left = "0";
    watermarkEl.style.position = watermarkElPosition;
    watermarkEl.style.zIndex = "99999";
    const { clientWidth, clientHeight } = parentEl.value!;
    updateWatermarkEl({ width: clientWidth, height: clientHeight });
    parentEl.value!.style.position = parentElPosition;
    parentEl.value!.appendChild(watermarkEl);
  };

  const updateWatermarkEl = (
    options: Partial<{
      width: number;
      height: number;
    }> = {},
  ) => {
    if (!watermarkEl) return;
    backupText &&
      (watermarkEl.style.background = `url(${createBase64()}) left top repeat`);
    options.width && (watermarkEl.style.width = `${options.width}px`);
    options.height && (watermarkEl.style.height = `${options.height}px`);
  };

  const createBase64 = () => {
    const { color, opacity, size, family, angle, width, height } = mergeConfig;
    const canvasEl = document.createElement("canvas");
    canvasEl.width = width;
    canvasEl.height = height;
    const ctx = canvasEl.getContext("2d");
    if (ctx) {
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;
      ctx.font = `${size}px ${family}`;
      ctx.rotate((Math.PI / 180) * angle);
      ctx.fillText(backupText, 0, height / 2);
    }
    return canvasEl.toDataURL();
  };

  const clearWatermark = () => {
    if (!parentEl.value || !watermarkEl) return;

    removeListener();

    try {
      parentEl.value.removeChild(watermarkEl);
    } catch {
      console.warn("水印元素已不存在，请重新创建");
    } finally {
      watermarkEl = null;
    }
  };

  const updateWatermark = debounce(() => {
    clearWatermark();
    createWatermarkEl();
    addElListener(parentEl.value!);
  }, 100);

  const addElListener = (targetNode: HTMLElement) => {
    if (mergeConfig.defense) {
      if (
        !observer.watermarkElMutationObserver &&
        !observer.parentElMutationObserver
      ) {
        addMutationListener(targetNode);
      }
    } else {
      removeListener("mutation");
    }
    if (!observer.parentElResizeObserver) {
      addResizeListener(targetNode);
    }
  };

  const removeListener = (kind: "mutation" | "resize" | "all" = "all") => {
    if (kind === "mutation" || kind === "all") {
      observer.watermarkElMutationObserver?.disconnect();
      observer.watermarkElMutationObserver = undefined;
      observer.parentElMutationObserver?.disconnect();
      observer.parentElMutationObserver = undefined;
    }
    if (kind === "resize" || kind === "all") {
      observer.parentElResizeObserver?.disconnect();
      observer.parentElResizeObserver = undefined;
    }
  };

  const addMutationListener = (targetNode: HTMLElement) => {
    const mutationCallback = debounce((mutationList: MutationRecord[]) => {
      mutationList.forEach(
        debounce((mutation: MutationRecord) => {
          switch (mutation.type) {
            case "attributes":
              mutation.target === watermarkEl && updateWatermark();
              break;
            case "childList":
              mutation.removedNodes.forEach((item) => {
                item === watermarkEl && targetNode.appendChild(watermarkEl);
              });
              break;
          }
        }, 100),
      );
    }, 100);
    observer.watermarkElMutationObserver = new MutationObserver(
      mutationCallback,
    );
    observer.parentElMutationObserver = new MutationObserver(mutationCallback);
    observer.watermarkElMutationObserver.observe(watermarkEl!, {
      attributes: true,
      childList: false,
      subtree: false,
    });
    observer.parentElMutationObserver.observe(targetNode, {
      attributes: false,
      childList: true,
      subtree: false,
    });
  };

  const addResizeListener = (targetNode: HTMLElement) => {
    const resizeCallback = debounce(() => {
      const { clientWidth, clientHeight } = targetNode;
      updateWatermarkEl({ width: clientWidth, height: clientHeight });
    }, 500);
    observer.parentElResizeObserver = new ResizeObserver(resizeCallback);
    observer.parentElResizeObserver.observe(targetNode);
  };

  onBeforeUnmount(() => {
    clearWatermark();
  });

  return { setWatermark, clearWatermark };
}
