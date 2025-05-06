import { useSettingsStore } from "@/pinia/stores/settings";

const GREY_MODE = "grey-mode";
const COLOR_WEAKNESS = "color-weakness";

const classList = document.documentElement.classList;

function initGreyAndColorWeakness() {
  const settingsStore = useSettingsStore();
  watchEffect(() => {
    classList.toggle(GREY_MODE, settingsStore.showGreyMode);
    classList.toggle(COLOR_WEAKNESS, settingsStore.showColorWeakness);
  });
}

export function useGreyAndColorWeakness() {
  return { initGreyAndColorWeakness };
}
