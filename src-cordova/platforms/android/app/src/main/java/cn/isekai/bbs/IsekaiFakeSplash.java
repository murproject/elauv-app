package cn.isekai.bbs;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.view.Window;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;

import android.view.View;
import android.view.Window;
import android.view.WindowManager;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaArgs;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;

public class IsekaiFakeSplash extends CordovaPlugin {

    private boolean isHide = false;

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        webView.getView().setAlpha(0);
    }

    @Override
    public boolean execute(String action, CordovaArgs args, CallbackContext callbackContext) {
        if ("hide".equals(action)) {
            if (!isHide) {
                cordova.getActivity().runOnUiThread(() -> {
                    Animation enterAnimate = AnimationUtils.loadAnimation(cordova.getContext(),
                            cordova.getContext().getResources().getIdentifier("fade_in",
                                    "anim",
                                    cordova.getContext().getPackageName()));

                    enterAnimate.setAnimationListener(new Animation.AnimationListener() {
                        @Override
                        public void onAnimationStart(Animation animation) {
                            webView.getView().setAlpha(1);
                        }

                        @SuppressLint("UseCompatLoadingForDrawables")
                        @Override
                        public void onAnimationEnd(Animation animation) {
                            cordova.getActivity().runOnUiThread(() -> {
                                Activity activity = cordova.getActivity();
                                Window window = activity.getWindow();
//                                 window.setBackgroundDrawable(
//                                         activity.getDrawable(
//                                                 android.R.drawable.screen_background_dark
//                                         )
//                                 );
                            });
                        }

                        @Override
                        public void onAnimationRepeat(Animation animation) {
                        }
                    });
                    webView.getView().startAnimation(enterAnimate);
                });
                isHide = true;
            }
            return true;
        }

        return false;
    }
}
