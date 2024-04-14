diff --git a/app/ui.js b/app/ui.js
index c1f6776..f71f9c4 100644
--- a/app/ui.js
+++ b/app/ui.js
@@ -127,6 +127,7 @@ const UI = {
         } else {
             autoconnect = false;
             // Show the connect panel on first load unless autoconnecting
+            // SolidCP: Don't open ConnectPanel
             UI.openConnectPanel();
         }
 
@@ -1055,6 +1056,8 @@ const UI = {
         UI.rfb.addEventListener("clipboard", UI.clipboardReceive);
         UI.rfb.addEventListener("bell", UI.bell);
         UI.rfb.addEventListener("desktopname", UI.updateDesktopName);
+        // SolidCP: Add fbresize event handler
+        UI.rfb.addEventListener("fbresize", UI.updateSessionSize);
         UI.rfb.clipViewport = UI.getSetting('view_clip');
         UI.rfb.scaleViewport = UI.getSetting('resize') === 'scale';
         UI.rfb.resizeSession = UI.getSetting('resize') === 'remote';
@@ -1759,24 +1762,43 @@ const UI = {
  *    /MISC
  * ==============
  */
+
+/* ------^-------
+ *    /SolidCP
+ * ==============
+ */
+
+    updateSessionSize(e) {
+        var rfb = e.detail.rfb;
+        var width = e.detail.width;
+        var height = e.detail.height;
+        UI.SCP.updateFBSize(rfb, width, height);
+        UI.applyResizeMode();
+        UI.updateViewClip();
+    },
+
+    setup() {
+        // Set up translations
+        const LINGUAS = ["cs", "de", "el", "es", "fr", "it", "ja", "ko", "nl", "pl", "pt_BR", "ru", "sv", "tr", "zh_CN", "zh_TW"];
+        l10n.setup(LINGUAS);
+        if (l10n.language === "en" || l10n.dictionary !== undefined) {
+            UI.prime();
+            UI.setupSolidCP();
+        } else {
+            fetch('app/locale/' + l10n.language + '.json')
+                .then((response) => {
+                    if (!response.ok) {
+                        throw Error("" + response.status + " " + response.statusText);
+                    }
+                    return response.json();
+                })
+                .then((translations) => { l10n.dictionary = translations; })
+                .catch(err => Log.Error("Failed to load translations: " + err))
+                .then(UI.prime)
+                .then(UI.setupSolidCP);
+        }
+    }
 };
 
-// Set up translations
-const LINGUAS = ["cs", "de", "el", "es", "fr", "it", "ja", "ko", "nl", "pl", "pt_BR", "ru", "sv", "tr", "zh_CN", "zh_TW"];
-l10n.setup(LINGUAS);
-if (l10n.language === "en" || l10n.dictionary !== undefined) {
-    UI.prime();
-} else {
-    fetch('app/locale/' + l10n.language + '.json')
-        .then((response) => {
-            if (!response.ok) {
-                throw Error("" + response.status + " " + response.statusText);
-            }
-            return response.json();
-        })
-        .then((translations) => { l10n.dictionary = translations; })
-        .catch(err => Log.Error("Failed to load translations: " + err))
-        .then(UI.prime);
-}
 
 export default UI;
