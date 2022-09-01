import Blockly from 'blockly';

const CustomRenderer = function(name) {
  CustomRenderer.superClass_.constructor.call(this, name);
};

Blockly.utils.object.inherits(CustomRenderer, Blockly.thrasos.Renderer);

Blockly.blockRendering.register('custom_renderer', CustomRenderer);

Blockly.ToolboxCategory.prototype.addColourBorder_ = function(colour) {
  if (colour) {
    const border = Blockly.ToolboxCategory.borderWidth + 'px solid ' + (colour || '#ddd');
    this.rowDiv_.style.color = Blockly.utils.colour.blend((colour || '#ddd'), '#000', 0.75);
    if (this.workspace_.RTL) {
      this.rowDiv_.style.borderRight = border;
    } else {
      this.rowDiv_.style.borderLeft = border;
    }
  }
};

const CustomConstantsProvider = function() {
  // Set up all of the constants from the base provider.
  CustomConstantsProvider.superClass_.constructor.call(this);

  this.NOTCH_WIDTH = 15;
  this.NOTCH_HEIGHT = 5;
  this.NOTCH_OFFSET_LEFT = 18.8;

  this.STATEMENT_INPUT_NOTCH_OFFSET = 19;

  this.CORNER_RADIUS = 5;
  this.TAB_WIDTH = 5;
  this.TAB_HEIGHT = 14;

  this.EXTERNAL_VALUE_INPUT_PADDING = 0;

  this.DUMMY_INPUT_MIN_HEIGHT = this.TAB_HEIGHT * 1.5;
  this.DUMMY_INPUT_SHADOW_MIN_HEIGHT = this.DUMMY_INPUT_MIN_HEIGHT;
  this.EMPTY_INLINE_INPUT_HEIGHT = this.TAB_HEIGHT * 1.75;

  this.TAB_OFFSET_FROM_TOP = 5;
  this.BETWEEN_STATEMENT_PADDING_Y = 5;

  this.TRIG_PREV_NEXT = this.makeTriangularPreviousConn();
  this.TRIG_INPUT_OUTPUT = this.makeTriangularInputConn();
  this.RECT_INPUT_OUTPUT = this.makeRectInputConn();

  this.FIELD_COLOUR_DEFAULT_WIDTH = 22;
  this.FIELD_COLOUR_DEFAULT_HEIGHT = 22;

  this.FIELD_DROPDOWN_BORDER_RECT_HEIGHT = 16;
  this.FIELD_BORDER_RECT_HEIGHT = 16;
  this.FIELD_DROPDOWN_COLOURED_DIV = true;

  this.FIELD_TEXT_FONTWEIGHT = 'bold';
  this.FIELD_TEXT_FONTFAMILY = 'Nunito';

  this.generateSecondaryColour_ = function(inputColour) {
    return Blockly.utils.colour.blend('#fff', inputColour, 0.3) || inputColour;
  };

  this.generateTertiaryColour_ = function(inputColour) {
    return Blockly.utils.colour.blend('#fff', inputColour, 0.2) || inputColour;
  };
};

Blockly.utils.object.inherits(CustomConstantsProvider,
    Blockly.blockRendering.ConstantProvider);

CustomRenderer.prototype.makeConstants_ = function() {
  return new CustomConstantsProvider();
};

CustomConstantsProvider.prototype.makeTriangularInputConn = function(e) {
  const width = this.TAB_WIDTH;
  const height = this.TAB_HEIGHT;

  function makeMainPath(up) {
    return Blockly.utils.svgPaths.line(
        [
          Blockly.utils.svgPaths.point(-width, up * (height / 2)),
          Blockly.utils.svgPaths.point(width, up * (height / 2)),
        ]);
  }

  const pathUp = makeMainPath(-1);
  const pathDown = makeMainPath(1);

  return {
    width: width,
    height: height,
    pathDown: pathDown,
    pathUp: pathUp,
  };
};

CustomConstantsProvider.prototype.makeRectInputConn = function(e) {
  const width = this.TAB_WIDTH;
  const height = this.TAB_HEIGHT;

  function makeMainPath(up) {
    return Blockly.utils.svgPaths.line(
        [
          Blockly.utils.svgPaths.point(-width, up * (0)),
          Blockly.utils.svgPaths.point(0, up * (height)),
          Blockly.utils.svgPaths.point(width, up * (0)),
        ]);
  }

  const pathUp = makeMainPath(-1);
  const pathDown = makeMainPath(1);

  return {
    width: width,
    height: height,
    pathDown: pathDown,
    pathUp: pathUp,
  };
};

CustomConstantsProvider.prototype.makeTriangularPreviousConn = function() {
  const width = this.NOTCH_WIDTH;
  const height = this.NOTCH_HEIGHT;

  /**
   * Since previous and next connections share the same shape
   * you can define a function to generate the path for both.
   */
  function makeMainPath(dir) {
    return Blockly.utils.svgPaths.line(
        [
          Blockly.utils.svgPaths.point(dir * width / 2, height),
          Blockly.utils.svgPaths.point(dir * width / 2, -height),
        ]);
  }
  const pathLeft = makeMainPath(1);
  const pathRight = makeMainPath(-1);

  return {
    width: width,
    height: height,
    pathLeft: pathLeft,
    pathRight: pathRight,
  };
};

CustomConstantsProvider.prototype.shapeFor = function(connection) {
  let checks = connection.getCheck();
  if (!checks && connection.targetConnection) {
    checks = connection.targetConnection.getCheck();
  }

  switch (connection.type) {
    case Blockly.INPUT_VALUE:
    case Blockly.OUTPUT_VALUE:
      if (checks && checks.includes('Boolean')) {
        return this.RECT_INPUT_OUTPUT;
      }
      return this.TRIG_INPUT_OUTPUT;

    case Blockly.PREVIOUS_STATEMENT:
    case Blockly.NEXT_STATEMENT:
      return this.TRIG_PREV_NEXT;
    default:
      throw Error('Unknown connection type');
  }
};

