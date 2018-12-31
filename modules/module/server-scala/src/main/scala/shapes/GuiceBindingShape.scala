package shapes

import com.google.inject.Module
import com.google.inject.util.Modules.EMPTY_MODULE

trait GuiceBindingShape {
  var bindings: Module = EMPTY_MODULE
}