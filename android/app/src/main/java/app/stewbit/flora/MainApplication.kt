package app.stewbit.flora

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.stallion.Stallion // <-- 1. Add the Stallion import

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // add(MyReactNativePackage())
        },
      // <-- 2. Tell React Native to load the JS Bundle from Stallion here -->
      jsBundleFilePath = Stallion.getJSBundleFile(applicationContext) 
    )
  }

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
  }
}