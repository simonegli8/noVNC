diff --git a/core/rfb.js b/core/rfb.js
index 6afd7c6..61aeb63 100644
--- a/core/rfb.js
+++ b/core/rfb.js
@@ -2881,6 +2881,15 @@ export default class RFB extends EventTargetMixin {
         this._updateClip();
         this._updateScale();
 
+        // SolidCP: fbresize event
+        var event = new CustomEvent("fbresize", {
+          detail: {
+             rfb: this,
+             width: width,
+             height: height }
+        });
+        this.dispatchEvent(event);
+
         this._updateContinuousUpdates();
 
         // Keep this size until browser client size changes
