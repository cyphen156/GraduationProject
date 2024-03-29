package com.hygp2;

import android.widget.Toast;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.HashMap;
import java.util.Map;

public class ToastButton extends ReactContextBaseJavaModule{
    ToastButton(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName(){
        return "ToastButton";
    }

    @ReactMethod
    public void show(String message, int duration){
        ReactApplicationContext context = getReactApplicationContext();

        Toast toast = Toast.makeText(context, message, duration);
        toast.show();
    }

    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();

        constants.put("SHORT",Toast.LENGTH_SHORT);
        constants.put("LONG",Toast.LENGTH_LONG);
        return constants;
    }
}
