import Blockly from 'blockly'

var CustomRenderer = function (name) {
  CustomRenderer.superClass_.constructor.call(this, name)
}

Blockly.utils.object.inherits(CustomRenderer, Blockly.thrasos.Renderer)

Blockly.blockRendering.register('custom_renderer', CustomRenderer)

var CustomConstantsProvider = function () {
  // Set up all of the constants from the base provider.
  CustomConstantsProvider.superClass_.constructor.call(this)

  this.NOTCH_WIDTH = 15
  this.NOTCH_HEIGHT = 5
  this.NOTCH_OFFSET_LEFT = 18.8
  // this.NOTCH_OFFSET_LEFT = 10

  this.STATEMENT_INPUT_NOTCH_OFFSET = 19;
  // this.STATEMENT_BOTTOM_SPACER = 0;
  // this.STATEMENT_INPUT_PADDING_LEFT = 20;

  // this.EXTERNAL_VALUE_INPUT_PADDING = 200
  // this.EMPTY_INLINE_INPUT_HEIGHT = 200
  // this.DUMMY_INPUT_SHADOW_MIN_HEIGHT = 200
  // this.STATEMENT_INPUT_NOTCH_OFFSET

  this.CORNER_RADIUS = 5
  // this.FIELD_BORDER_RECT_RADIUS = 0
  this.TAB_WIDTH = 5
  this.TAB_HEIGHT = 14

  // this.EMPTY_INLINE_INPUT_PADDING = 200
  this.EXTERNAL_VALUE_INPUT_PADDING = 0

  this.DUMMY_INPUT_MIN_HEIGHT = this.TAB_HEIGHT * 1.5
  this.DUMMY_INPUT_SHADOW_MIN_HEIGHT = this.DUMMY_INPUT_MIN_HEIGHT
  this.EMPTY_INLINE_INPUT_HEIGHT = this.TAB_HEIGHT * 1.75

  this.TAB_OFFSET_FROM_TOP = 5
  this.BETWEEN_STATEMENT_PADDING_Y = 5

  // this.TAB_VERTICAL_OVERLAP = 800

  this.TRIG_PREV_NEXT = this.makeTriangularPreviousConn()
  this.TRIG_INPUT_OUTPUT = this.makeTriangularInputConn()
  this.RECT_INPUT_OUTPUT = this.makeRectInputConn()

  this.FIELD_COLOUR_DEFAULT_WIDTH = 22
  this.FIELD_COLOUR_DEFAULT_HEIGHT = 22

  this.FIELD_DROPDOWN_BORDER_RECT_HEIGHT = 16
  this.FIELD_BORDER_RECT_HEIGHT = 16
  this.FIELD_DROPDOWN_COLOURED_DIV = true

  // this.FIELD_DROPDOWN_BORDER_RECT_HEIGHT = this.FIELD_BORDER_RECT_HEIGHT;

  this.FIELD_TEXT_FONTWEIGHT = 'bold';
  this.FIELD_TEXT_FONTFAMILY = 'Nunito';

  this.generateSecondaryColour_ = function (inputColour) {
    return Blockly.utils.colour.blend('#fff', inputColour, 0.3) || inputColour;
  }
}

Blockly.utils.object.inherits(CustomConstantsProvider,
  Blockly.blockRendering.ConstantProvider)

CustomRenderer.prototype.makeConstants_ = function () {
  return new CustomConstantsProvider()
}

CustomConstantsProvider.prototype.makeTriangularInputConn = function (e) {
  var width = this.TAB_WIDTH
  var height = this.TAB_HEIGHT

  function makeMainPath(up) {
    return Blockly.utils.svgPaths.line(
      [
        Blockly.utils.svgPaths.point(-width, up * (height / 2)),
        Blockly.utils.svgPaths.point(width, up * (height / 2))

        // Blockly.utils.svgPaths.point(-width / 2, 0),
        // Blockly.utils.svgPaths.point(-width, -1 * up * (height / 2)),
        // Blockly.utils.svgPaths.point(width, -1 * up * (height / 2)),
        // Blockly.utils.svgPaths.point(width / 2, 0)

        // Blockly.utils.svgPaths.point(-width, -1 * up * (height / 2)),
        // Blockly.utils.svgPaths.point(width, -1 * up * (height / 2))
      ])
  }

  var pathUp = makeMainPath(-1)
  var pathDown = makeMainPath(1)

  return {
    width: width,
    height: height,
    pathDown: pathDown,
    pathUp: pathUp
  }
}

CustomConstantsProvider.prototype.makeRectInputConn = function (e) {
  var width = this.TAB_WIDTH
  var height = this.TAB_HEIGHT

  function makeMainPath(up) {
    return Blockly.utils.svgPaths.line(
      [
        Blockly.utils.svgPaths.point(-width, up * (0)),
        Blockly.utils.svgPaths.point(0, up * (height)),
        Blockly.utils.svgPaths.point(width, up * (0))
      ])
  }

  var pathUp = makeMainPath(-1)
  var pathDown = makeMainPath(1)

  return {
    width: width,
    height: height,
    pathDown: pathDown,
    pathUp: pathUp
  }
}

CustomConstantsProvider.prototype.makeTriangularPreviousConn = function () {
  var width = this.NOTCH_WIDTH
  var height = this.NOTCH_HEIGHT

  /**
   * Since previous and next connections share the same shape
   * you can define a function to generate the path for both.
   */
  function makeMainPath(dir) {
    return Blockly.utils.svgPaths.line(
      [
        // Blockly.utils.svgPaths.point(0, height),
        // Blockly.utils.svgPaths.point(dir * width, 0),
        // Blockly.utils.svgPaths.point(0, -height)
        Blockly.utils.svgPaths.point(dir * width / 2, height),
        // Blockly.utils.svgPaths.point(dir * width, 0),
        Blockly.utils.svgPaths.point(dir * width / 2, -height)
      ])
  }
  var pathLeft = makeMainPath(1)
  var pathRight = makeMainPath(-1)

  return {
    width: width,
    height: height,
    pathLeft: pathLeft,
    pathRight: pathRight
  }
}

CustomConstantsProvider.prototype.shapeFor = function (connection) {
  // var checks = connection.getCheck();

  let checks = connection.getCheck();
  if (!checks && connection.targetConnection) {
    checks = connection.targetConnection.getCheck();
  }

  let outputShape;

  switch (connection.type) {
    case Blockly.INPUT_VALUE:
    case Blockly.OUTPUT_VALUE:

      // console.log(connection.getSourceBlock().getOutputShape())

      if (checks && checks.includes('Boolean')) {
        return this.RECT_INPUT_OUTPUT
      }
      return this.TRIG_INPUT_OUTPUT

      // TODO: make outputShape, like in zelos renderer
      // outputShape = connection.getSourceBlock().getOutputShape();
      // if (outputShape !== null) {
      //   switch (outputShape) {
      //     case this.SHAPES.HEXAGONAL:
      //       return this.HEXAGONAL;
      //     case this.SHAPES.ROUND:
      //       return this.ROUNDED;
      //     case this.SHAPES.SQUARE:
      //       return this.SQUARED;
      //   }
      // }

      // if (checks && checks.indexOf('Boolean') !== -1) {
      //   return this.HEXAGONAL;
      // }
      // if (checks && checks.indexOf('Number') !== -1) {
      //   return this.ROUNDED;
      // }
      // if (checks && checks.indexOf('String') !== -1) {
      //   return this.ROUNDED;
      // }

      // return (this.ROUNDED);

    case Blockly.PREVIOUS_STATEMENT:
    case Blockly.NEXT_STATEMENT:
      return this.TRIG_PREV_NEXT
    default:
      throw Error('Unknown connection type')
  }
}

// TODO: replace prompt dialogs - https://developers.google.com/blockly/reference/js/Blockly.dialog?hl=en
