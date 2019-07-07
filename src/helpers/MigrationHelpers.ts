import {ExportTile, ExportWorld, MajorLineDirection, Tile} from "../types/world";
import {Logger} from "./logger";
import {FieldShape, FieldSymbol, ImgShape, ImgSymbol, LineShape, LineSymbol} from "../types/drawing";
import {appProperties, defaultGameInitCode, defaultTileHeight, defaultTileWidth, getDefaultNewTile} from "../constants";
import {DialogHelper} from "./dialogHelper";


interface MigrationClass {

  /**
   * the old version
   */
  oldVersion: string
  /**
   * the new version we update the tiles/world to
   */
  newVersion: string

  /**
   * changes the tile to match the new version
   *
   * this must create a new tile (no reference)
   * @param {ExportTile} exportTile exportWorld the old tile
   * @returns {ExportTile}
   */
  migrateTile(exportTile: ExportTile): ExportTile

  /**
   * changes the world to match the new version
   *
   * this must create a new world (no reference)
   * @param {ExportWorld} exportWorld the old world
   * @returns {ExportWorld} the migrated world
   */
  migrateWorld(exportWorld: ExportWorld): ExportWorld

  /**
   * a message to display to the user what changed when migrating a tile/world to this new version
   * can be empty string
   */
  warningMsg: string
}

/**
 * migration for version 1.0.0 to 1.0.1
 *
 * added props
 *  ImgBase.isMouseDisabled
 */
class Migration_1_0_0__to__1_0_1 implements MigrationClass {

  oldVersion = '1.0.0'
  newVersion = '1.0.1'
  warningMsg = ''

  public migrateTile(exportTile: ExportTile): ExportTile {

    const copy: ExportTile = {
      ...exportTile,
      editorVersion: this.newVersion,
      tile: {
        ...exportTile.tile,
        imgShapes: exportTile.tile.imgShapes.map((value, index) => {
          return {
            ...value,
            isMouseDisabled: false
          }
        })
      },
      imgSymbols: exportTile.imgSymbols.map((value, index) => {
        return {
          ...value,
          isMouseDisabled: false
        }
      }),
    }
    return copy
  }

  public migrateWorld(exportWorld: ExportWorld): ExportWorld {

    const copy: ExportWorld = {
      ...exportWorld,
      editorVersion: this.newVersion,
      imgSymbols: exportWorld.imgSymbols.map((value, index) => {
        return {
          ...value,
          isMouseDisabled: false
        }
      }),
      allTiles: exportWorld.allTiles.map((tile) => {
        return {
          ...tile,
          imgShapes: tile.imgShapes.map((value, index) => {
            return {
              ...value,
              isMouseDisabled: false
            }
          })
        }
      })
    }

    return copy
  }


}

/**
 * migration for version 1.0.1 to 1.0.2
 *
 * added props
 *  FieldBase.imgGuid
 */
class Migration_1_0_1__to__1_0_2 implements MigrationClass {

  oldVersion = '1.0.1'
  newVersion = '1.0.2'
  warningMsg = ''

  public migrateTile(exportTile: ExportTile): ExportTile {

    const copy: ExportTile = {
      ...exportTile,
      editorVersion: this.newVersion,
      tile: {
        ...exportTile.tile,
        fieldShapes: exportTile.tile.fieldShapes.map((value, index) => {
          return {
            ...value,
            backgroundImgGuid: null
          }
        })
      },
      fieldSymbols: exportTile.fieldSymbols.map((value, index) => {
        return {
          ...value,
          backgroundImgGuid: null
        }
      }),
    }
    return copy
  }

  public migrateWorld(exportWorld: ExportWorld): ExportWorld {

    const copy: ExportWorld = {
      ...exportWorld,
      editorVersion: this.newVersion,
      fieldSymbols: exportWorld.fieldSymbols.map((value, index) => {
        return {
          ...value,
          backgroundImgGuid: null
        }
      }),
      allTiles: exportWorld.allTiles.map((tile) => {
        return {
          ...tile,
          fieldShapes: tile.fieldShapes.map((value, index) => {
            return {
              ...value,
              backgroundImgGuid: null
            }
          })
        }
      })
    }

    return copy
  }

}


//--- shallow migration: createVersionShallowMigration('1.0.2', '1.0.3')

/**
 * migration for version 1.0.3 to 1.1.0
 *
 * we changed to tile to have a field tileSettings where we save the tile settings so they can be exported
 *   also we moved some tile props into the tileSettings
 *
 * when exporting the world we now also export the world settings (all world settings!)
 */
class Migration_1_0_3__to__1_1_0 implements MigrationClass {

  oldVersion = '1.0.3'
  newVersion = '1.1.0'
  warningMsg = ''

  public migrateTile(exportTile: ExportTile): ExportTile {

    const copy: ExportTile = {
      ...exportTile,
      editorVersion: this.newVersion,
      tile: {
        ...exportTile.tile,
        tileSettings: { //this was added, use the default values at that time
          displayName: exportTile.tile['displayName'], //moved into settings
          width: exportTile.tile['width'], //moved into settings
          height: exportTile.tile['height'], //moved into settings
          majorLineDirection: MajorLineDirection.topToBottom,
          gridSizeInPx: 10,
          showGrid: true,
          snapToGrid: true,
          showSequenceIds: false,
          moveBezierControlPointsWhenLineIsMoved: true,
          arePrintGuidesDisplayed: false,
          autoIncrementFieldTextNumbersOnDuplicate: true,
          printLargeTilePreferredWidthInPx: 500,
          printLargeTilePreferredHeightInPx: 500,
          splitLargeTileForPrint: true,
          insertLinesEvenIfFieldsIntersect: false,
        }
      }
    }
    //we moved them so remove in the upper level
    delete copy.tile['displayName']
    delete copy.tile['width']
    delete copy.tile['height']

    return copy
  }

  public migrateWorld(exportWorld: ExportWorld): ExportWorld {

    //use the settings that were default at that time (so all get the same migration regardless of the current values (from the latest version)

    const defaultTileSettings = getDefaultNewTile().tileSettings

    const copy: ExportWorld = {
      ...exportWorld,
      editorVersion: this.newVersion,
      worldSettings: {
        selectedFieldBorderColor: 'blue',
        selectedFieldBorderThicknessInPx: 1,
        gridStrokeThicknessInPx: 0.2,
        gridStrokeColor: 'gray',
        linePointsUiDiameter: 3,
        linePointsUiColor: 'black',
        tileMidPointsUiColor: '#f1b213',
        tileMidPointsDiameter: 3,
        lineBezierControlPoint1UiDiameter: 3,
        lineBezierControlPoint1UiColor: 'green',
        lineBezierControlPoint2UiDiameter: 3,
        lineBezierControlPoint2UiColor: 'blue',
        fieldSequenceBoxColor: 'black',
        fieldSequenceFont: 'Arial',
        fieldSequenceFontColor: 'black',
        fieldSequenceFontSizeInPx: 12,
        anchorPointColor: '#f1b213',
        anchorPointDiameter: 3,
        anchorPointSnapToleranceRadiusInPx: 7,

        stageOffsetX: 0,
        stageOffsetY: 0,
        stageScaleX: 1,
        stageScaleY: 1,
        stageOffsetXScaleCorrection: 0,
        stageOffsetYScaleCorrection: 0,

        worldWidthInTiles: exportWorld['worldWidthInTiles'], //this was saved
        worldHeightInTiles: exportWorld['worldHeightInTiles'], //this was saved
        expectedTileWidth: exportWorld['expectedTileWidth'], //this was saved
        expectedTileHeight: exportWorld['expectedTileHeight'], //this was saved

        worldCmdText: defaultGameInitCode,
        printGameAsOneImage: false,
        printScale: 1,
        additionalBorderWidthInPx: 5,

        timeInS_rollDice: 2,
        timeInS_choose_bool_func: 2,
        timeInS_goto: 1.5,
        timeInS_set_var: 3,
        timeInS_advancePlayer: 1,
        timeInS_rollback: 2,
        timeInS_var_decl: 3,
        timeInS_expr_primary_leftSteps: 2,
        timeInS_expr_primary_constant: 0.5,
        timeInS_expr_primary_ident: 1,
        timeInS_expr_primary_incrementOrDecrement: 1,
        timeInS_expr_disjunction: 1,
        timeInS_expr_conjunction: 1,
        timeInS_expr_comparison: 1,
        timeInS_expr_relation: 1,
        timeInS_expr_sum: 1,
        timeInS_expr_term: 1,
        timeInS_expr_factor: 1,

        alwaysInsertArrowHeadsWhenAutoConnectingFields: true,
        anchorPointSomeConnectedColor: 'green',

        forcedFieldIsFontItalic: false,
        forcedFieldIsFontBold: true,
        forcedFieldBorderColor: 'black',
        forcedFieldAutoBorderSizeInPx: 12,
        forcedFieldAutoPrependText: '\\f071',
        forcedFieldBgColor: '#DDDDDD',
        forcedFieldColor: 'black',

        startFieldIsFontItalic: false,
        startFieldIsFontBold: true,
        startFieldBorderColor: 'black',
        startFieldAutoBorderSizeInPx: 12,
        startFieldAutoPrependText: '\\f35a',
        startFieldBgColor: '#DDDDDD',
        startFieldColor: 'black',

        endFieldIsFontItalic: false,
        endFieldIsFontBold: true,
        endFieldBorderColor: 'black',
        endFieldAutoBorderSizeInPx: 12,
        endFieldAutoPrependText: '\\f11e',
        endFieldBgColor: '#DDDDDD',
        endFieldColor: 'black',

        branchIfIsFontItalic: false,
        branchIfIsFontBold: true,
        branchIfPrependText: '\\f126',
        branchIfBorderColor: 'black',
        branchIfAutoBorderSizeInPx: 2,
        branchIfBgColor: '#DDDDDD',
        branchIfColor: 'black',
      },
      allTiles: exportWorld.allTiles.map(exportTile => {
        return {
          ...exportTile,
          tileSettings: {
            ...exportTile.tileSettings,
            printLargeTilePreferredWidthInPx: defaultTileSettings.printLargeTilePreferredWidthInPx,
            printLargeTilePreferredHeightInPx: defaultTileSettings.printLargeTilePreferredHeightInPx,
            width: exportTile['width'],
            height: exportTile['height'],
            displayName: exportTile['displayName'],
            arePrintGuidesDisplayed: defaultTileSettings.arePrintGuidesDisplayed,
            autoIncrementFieldTextNumbersOnDuplicate: defaultTileSettings.autoIncrementFieldTextNumbersOnDuplicate,
            gridSizeInPx: defaultTileSettings.gridSizeInPx,
            majorLineDirection: defaultTileSettings.majorLineDirection,
            moveBezierControlPointsWhenLineIsMoved: defaultTileSettings.moveBezierControlPointsWhenLineIsMoved,
            showGrid: defaultTileSettings.showGrid,
            showSequenceIds: defaultTileSettings.showSequenceIds,
            snapToGrid: defaultTileSettings.snapToGrid,
            splitLargeTileForPrint: defaultTileSettings.splitLargeTileForPrint,
          }
        }
      })
    }

    return copy
  }

}

class Migration_1_1_0__to__1_1_1 implements MigrationClass {

  oldVersion = '1.1.0'
  newVersion = '1.1.1'
  warningMsg = ''

  public migrateTile(exportTile: ExportTile): ExportTile {

    const copy: ExportTile = {
      ...exportTile,
      editorVersion: this.newVersion
    }

    return copy
  }

  public migrateWorld(exportWorld: ExportWorld): ExportWorld {

    const defaultTileSettings = getDefaultNewTile().tileSettings

    const copy: ExportWorld = {
      ...exportWorld,
      editorVersion: this.newVersion,
      allTiles: exportWorld.allTiles.map(exportTile => {
        return {
          ...exportTile,
          tileSettings: {
            ...exportTile.tileSettings,
            printLargeTilePreferredWidthInPx: defaultTileSettings.printLargeTilePreferredWidthInPx,
            printLargeTilePreferredHeightInPx: defaultTileSettings.printLargeTilePreferredHeightInPx,
            width: exportTile['width'] === undefined ? exportTile.tileSettings.width : exportTile['width'],
            height: exportTile['height'] === undefined ? exportTile.tileSettings.width : exportTile['height'],
            displayName: (exportTile['displayName'] === undefined || exportTile['displayName'] === '') ? exportTile.tileSettings.width : exportTile['displayName'],
            arePrintGuidesDisplayed: defaultTileSettings.arePrintGuidesDisplayed,
            autoIncrementFieldTextNumbersOnDuplicate: defaultTileSettings.autoIncrementFieldTextNumbersOnDuplicate,
            gridSizeInPx: defaultTileSettings.gridSizeInPx,
            majorLineDirection: defaultTileSettings.majorLineDirection,
            moveBezierControlPointsWhenLineIsMoved: defaultTileSettings.moveBezierControlPointsWhenLineIsMoved,
            showGrid: defaultTileSettings.showGrid,
            showSequenceIds: defaultTileSettings.showSequenceIds,
            snapToGrid: defaultTileSettings.snapToGrid,
            splitLargeTileForPrint: defaultTileSettings.splitLargeTileForPrint,
          }
        }
      })
    }

    return copy
  }

}

class Migration_1_2_0__to__1_2_1 implements MigrationClass {

  oldVersion = '1.2.0'
  newVersion = '1.2.1'
  warningMsg = ''

  migrateTile(exportTile: ExportTile): ExportTile {
    const copy: ExportTile = {
      ...exportTile,
      editorVersion: this.newVersion,
      tile: {
        ...exportTile.tile,
        tileSettings: {
          ...exportTile.tile.tileSettings,
          insertLinesEvenIfFieldsIntersect: false
        },
        fieldShapes: exportTile.tile.fieldShapes.map<FieldShape>(p => {
          return {
            ...p,
            kind: "field"
          }
        }),
        lineShapes: exportTile.tile.lineShapes.map<LineShape>(p => {
          return {
            ...p,
            kind: "line"
          }
        }),
        imgShapes: exportTile.tile.imgShapes.map<ImgShape>(p => {
          return {
            ...p,
            kind: "img"
          }
        }),
      },
      fieldSymbols: exportTile.fieldSymbols.map<FieldSymbol>(p => {
        return {
          ...p,
          kind: "field"
        }
      }),
      imgSymbols: exportTile.imgSymbols.map<ImgSymbol>(p => {
        return {
          ...p,
          kind: "img"
        }
      }),
      lineSymbols: exportTile.lineSymbols.map<LineSymbol>(p => {
        return {
          ...p,
          kind: "line"
        }
      })
    }

    return copy
  }

  migrateWorld(exportWorld: ExportWorld): ExportWorld {
    const copy: ExportWorld = {
      ...exportWorld,
      editorVersion: this.newVersion,
      worldSettings: {
        ...exportWorld.worldSettings,
        printScale: 1
      },
      fieldSymbols: exportWorld.fieldSymbols.map<FieldSymbol>(fieldSymbol => {
        return {
          ...fieldSymbol,
          overwriteBackgroundImage: true,
          overwriteRotationInDeg: true,
          overwriteCornerRadius: true,
          overwritePadding: true,
          overwriteVerticalTextAlign: true,
          overwriteHorizontalTextAlign: true,
          overwriteHeight: true,
          overwriteWidth: true,
          overwriteColor: true,
          overwriteBgColor: true,
          overwriteBorderColor: true,
          overwriteBorderSizeInPx: true,
          overwriteFontName: true,
          overwriteFontSizeInPx: true,
          overwriteFontDecoration: true,
          overwriteText: true,
          kind: "field"
        }
      }),
      imgSymbols: exportWorld.imgSymbols.map<ImgSymbol>(imgSymbol => {
        return {
          ...imgSymbol,
          overwriteHeight: true,
          overwriteImage: true,
          overwriteIsDisabledForMouseSelection: true,
          overwriteRotationInDeg: true,
          overwriteSkewX: true,
          overwriteSkewY: true,
          overwriteWidth: true,
          kind: "img"
        }
      }),
      lineSymbols: exportWorld.lineSymbols.map<LineSymbol>(lineSymbol => {
        return {
          ...lineSymbol,
          overwriteArrowHeight: true,
          overwriteArrowWidth: true,
          overwriteColor: true,
          overwriteGapsInPx: true,
          overwriteHasEndArrow: true,
          overwriteHasStartArrow: true,
          overwriteThicknessInPx: true,
          kind: "line"
        } as LineSymbol
      }),

      allTiles: exportWorld.allTiles.map(tile => {
        return {
          ...tile,
          fieldShapes: tile.fieldShapes.map(p => {
            return {
              ...p,
              kind: "field"
            }
          }) as ReadonlyArray<FieldShape>,
          lineShapes: tile.lineShapes.map(p => {
            return {
              ...p,
              kind: "line"
            }
          }) as ReadonlyArray<LineShape>,
          imgShapes: tile.imgShapes.map(p => {
            return {
              ...p,
              kind: "img"
            }
          }) as ReadonlyArray<ImgShape>,
        }
      })
    }

    return copy
  }
}

class Migration_1_2_2__to__1_2_3 implements MigrationClass {
  oldVersion = '1.2.2'
  newVersion = '1.2.3'
  warningMsg = ''

  public migrateTile(exportTile: ExportTile): ExportTile {
    return {
      ...exportTile,
      editorVersion: this.newVersion
    }
  }

  migrateWorld(exportWorld: ExportWorld): ExportWorld {
    return {
      ...exportWorld,
      editorVersion: this.newVersion,
      worldSettings: {
        ...exportWorld.worldSettings,
        additionalBorderWidthInPx: 5
      }
    }
  }

}

/**
 * we migrate to a new line connection system --> drop all old
 */
class Migration_1_2_3__to__1_3_0 implements MigrationClass {
  oldVersion = '1.2.3'
  newVersion = '1.3.0'

  warningMsg = 'We changed the connected lines system (field to lines), thus we dropped all the connected lines information in your fields. Please reconnect all your lines and fields!'

  public migrateTile(exportTile: ExportTile): ExportTile {

    let maxId = 0

    maxId = Math.max(
      ...exportTile.tile.fieldShapes.map(p => p.id),
      ...exportTile.tile.imgShapes.map(p => p.id),
      ...exportTile.tile.lineShapes.map(p => p.id),
    )

    for (let i = 0; i < exportTile.tile.lineShapes.length; i++) {
      const lineShape = exportTile.tile.lineShapes[i];

      maxId = Math.max(maxId, lineShape.startPoint.id)
      maxId = Math.max(maxId, ...lineShape.points.map(p => p.id))
    }

    exportTile = {
      ...exportTile,
      editorVersion: this.newVersion,

      fieldSymbols: exportTile.fieldSymbols.map(fieldS => {
        return {
          ...fieldS,
          anchorPoints: fieldS.anchorPoints.map(p => {
            return {
              ...p,
              connectedLineTuples: [],
              id: maxId++
            }
          })
        }
      })
    }


    let newVar = {
      ...exportTile,
      editorVersion: this.newVersion,
      tile: {
        ...exportTile.tile,
        fieldShapes: exportTile.tile.fieldShapes.map(field => {

          const symbol = field.createdFromSymbolGuid === null
            ? undefined
            : exportTile.fieldSymbols.find(p => p.guid === field.createdFromSymbolGuid)

          return {
            ...field,
            anchorPoints: symbol
              ? symbol.anchorPoints.map(p => {
                return {
                  ...p
                }
              })
              : field.anchorPoints.map(p => {
                return {
                  ...p,
                  connectedLineTuples: [],
                  id: maxId++
                }
              })
          }
        }),
        topBorderPoints: exportTile.tile.topBorderPoints.map(p => {
          return {
            ...p,
            connectedLineTuples: [],
            id: maxId++
          }
        }),
        botBorderPoints: exportTile.tile.botBorderPoints.map(p => {
          return {
            ...p,
            connectedLineTuples: [],
            id: maxId++
          }
        }),
        leftBorderPoints: exportTile.tile.leftBorderPoints.map(p => {
          return {
            ...p,
            connectedLineTuples: [],
            id: maxId++
          }
        }),
        rightBorderPoint: exportTile.tile.rightBorderPoint.map(p => {
          return {
            ...p,
            connectedLineTuples: [],
            id: maxId++
          }
        }),
      }
    };
    return newVar
  }

  migrateWorld(exportWorld: ExportWorld): ExportWorld {

    let maxId = 2000 //...

    exportWorld = {
      ...exportWorld,
      editorVersion: this.newVersion,

      fieldSymbols: exportWorld.fieldSymbols.map(fieldS => {
        return {
          ...fieldS,
          anchorPoints: fieldS.anchorPoints.map(p => {
            return {
              ...p,
              connectedLineTuples: [],
              id: maxId++
            }
          })
        }
      })
    }

    return {
      ...exportWorld,
      editorVersion: this.newVersion,
      allTiles: exportWorld.allTiles.map(tile => {

        let maxId = 0

        maxId = Math.max(
          ...tile.fieldShapes.map(p => p.id),
          ...tile.imgShapes.map(p => p.id),
          ...tile.lineShapes.map(p => p.id),
        )

        for (let i = 0; i < tile.lineShapes.length; i++) {
          const lineShape = tile.lineShapes[i];

          maxId = Math.max(maxId, lineShape.startPoint.id)
          maxId = Math.max(maxId, ...lineShape.points.map(p => p.id))
        }

        return {
          ...tile,
          fieldShapes: tile.fieldShapes.map(field => {
            return {
              ...field,
              anchorPoints: field.anchorPoints.map(p => {
                return {
                  ...p,
                  connectedLineTuples: [],
                  id: maxId++
                }
              })
            }
          }),
          topBorderPoints: tile.topBorderPoints.map(p => {
            return {
              ...p,
              connectedLineTuples: [],
              id: maxId++
            }
          }),
          botBorderPoints: tile.botBorderPoints.map(p => {
            return {
              ...p,
              connectedLineTuples: [],
              id: maxId++
            }
          }),
          leftBorderPoints: tile.leftBorderPoints.map(p => {
            return {
              ...p,
              connectedLineTuples: [],
              id: maxId++
            }
          }),
          rightBorderPoint: tile.rightBorderPoint.map(p => {
            return {
              ...p,
              connectedLineTuples: [],
              id: maxId++
            }
          }),
        }
      }),
      //not sure when we added these settings so to be sure add them here too
      worldSettings: {
        ...exportWorld.worldSettings,
        anchorPointSomeConnectedColor: 'green',
        alwaysInsertArrowHeadsWhenAutoConnectingFields: true,
        forcedFieldIsFontItalic: false,
        forcedFieldIsFontBold: true,
        forcedFieldBorderColor: 'black',
        forcedFieldAutoBorderSizeInPx: 12,
        forcedFieldAutoPrependText: '\\f071',
        forcedFieldBgColor: '#DDDDDD',
        forcedFieldColor: 'black',

        startFieldIsFontItalic: false,
        startFieldIsFontBold: true,
        startFieldBorderColor: 'black',
        startFieldAutoBorderSizeInPx: 12,
        startFieldAutoPrependText: '\\f35a',
        startFieldBgColor: '#DDDDDD',
        startFieldColor: 'black',

        endFieldIsFontItalic: false,
        endFieldIsFontBold: true,
        endFieldBorderColor: 'black',
        endFieldAutoBorderSizeInPx: 12,
        endFieldAutoPrependText: '\\f11e',
        endFieldBgColor: '#DDDDDD',
        endFieldColor: 'black',

        branchIfIsFontItalic: false,
        branchIfIsFontBold: true,
        branchIfPrependText: '\\f126',
        branchIfBorderColor: 'black',
        branchIfAutoBorderSizeInPx: 2,
        branchIfBgColor: '#DDDDDD',
        branchIfColor: 'black',
      },
    }
  }

}

class Migration_1_3_1__to__1_3_2 implements MigrationClass {
  oldVersion = '1.3.1'
  newVersion = '1.3.2'
  warningMsg: string;

  migrateTile(exportTile: ExportTile): ExportTile {
    return {
      ...exportTile,
      editorVersion: this.newVersion
    };
  }

  migrateWorld(exportWorld: ExportWorld): ExportWorld {
    return {
      ...exportWorld,
      editorVersion: this.newVersion,

      worldSettings: {
        ...exportWorld.worldSettings,

        anchorPointSomeConnectedColor: 'green',
        alwaysInsertArrowHeadsWhenAutoConnectingFields: true,
        forcedFieldIsFontItalic: false,
        forcedFieldIsFontBold: true,
        forcedFieldBorderColor: 'black',
        forcedFieldAutoBorderSizeInPx: 12,
        forcedFieldAutoPrependText: '\\f071',
        forcedFieldBgColor: '#DDDDDD',
        forcedFieldColor: 'black',

        startFieldIsFontItalic: false,
        startFieldIsFontBold: true,
        startFieldBorderColor: 'black',
        startFieldAutoBorderSizeInPx: 12,
        startFieldAutoPrependText: '\\f35a',
        startFieldBgColor: '#DDDDDD',
        startFieldColor: 'black',

        endFieldIsFontItalic: false,
        endFieldIsFontBold: true,
        endFieldBorderColor: 'black',
        endFieldAutoBorderSizeInPx: 12,
        endFieldAutoPrependText: '\\f11e',
        endFieldBgColor: '#DDDDDD',
        endFieldColor: 'black',

        branchIfIsFontItalic: false,
        branchIfIsFontBold: true,
        branchIfPrependText: '\\f126',
        branchIfBorderColor: 'black',
        branchIfAutoBorderSizeInPx: 2,
        branchIfBgColor: '#DDDDDD',
        branchIfColor: 'black',
      }
    };
  }

}

/**
 * a helper to create a shallow migration (no field/img/line props are changed, model) only ui stuff
 * @param {string} oldVersion
 * @param {string} newVersion
 * @returns {MigrationClass}
 */
function createVersionShallowMigration(oldVersion: string, newVersion: string): MigrationClass {
  return {
    oldVersion,
    newVersion,
    warningMsg: '',
    migrateTile: exportTile => {
      return {
        ...exportTile,
        editorVersion: newVersion
      }
    },
    migrateWorld: exportWorld => {
      return {
        ...exportWorld,
        editorVersion: newVersion
      }
    }
  }
}

export class MigrationHelper {
  private constructor() {
  }

  public static readonly versionsToSkip: string[] = []

  /**
   * make sure this is in sync with the version in
   * @see appProperties.version
   * @type {Migration_1_0_0__to__1_0_1[]}
   */
  public static readonly allMigrations: ReadonlyArray<MigrationClass> = [
    new Migration_1_0_0__to__1_0_1(),
    new Migration_1_0_1__to__1_0_2(),
    createVersionShallowMigration('1.0.2', '1.0.3'),
    new Migration_1_0_3__to__1_1_0(),
    new Migration_1_1_0__to__1_1_1(),
    createVersionShallowMigration('1.1.1', '1.2.0'), //we added var export & fixed some simulation lang issues
    new Migration_1_2_0__to__1_2_1(),
    createVersionShallowMigration('1.2.1', '1.2.2'),
    new Migration_1_2_2__to__1_2_3(),
    new Migration_1_2_3__to__1_3_0(),
    createVersionShallowMigration('1.3.0', '1.3.1'),
    new Migration_1_3_1__to__1_3_2(),
  ]

  /**
   * applies all pending migrations to the tile
   * the returned tile version is the latest version
   *
   * this cannot be async because for file inputs react would rerender the input and the file list would get discarded
   *
   * a new obj is created
   * @param {ExportTile} exportTile
   * @returns {ExportTile | null} null on any error
   */
  public static applyMigrationsToTile(exportTile: ExportTile): ExportTile | null {

    for (let i = 0; i < this.allMigrations.length; i++) {
      const migration = this.allMigrations[i]

      if (migration.oldVersion === exportTile.editorVersion) {
        try {
          exportTile = migration.migrateTile(exportTile)
          Logger.log(`migrated export tile from version ${migration.oldVersion} to ${migration.newVersion}`)


          if (migration.warningMsg) {
            Logger.log(`Migration version ${migration.oldVersion} to ${migration.newVersion}, msg: ${migration.warningMsg}`)
            // DialogHelper.okDialog(`Migration version ${migration.oldVersion} to ${migration.newVersion}`, migration.warningMsg)
          }

        } catch (err) {
          Logger.fatal(`migrating export tile failed from version ${migration.oldVersion} to ${migration.newVersion}`)
          return null
        }
      } else {


      }
    }


    if (exportTile.editorVersion !== appProperties.version) {
      Logger.fatal(`we missed some migrations... up migrated version is ${exportTile.editorVersion} editor version is ${appProperties.version}`)
    }

    return exportTile
  }

  /**
   * applies all pending migrations to the world
   * the returned world version is the latest version
   *
   * this cannot be async because for file inputs react would rerender the input and the file list would get discarded
   *
   * a new obj is created
   * @param {ExportWorld} exportWorld
   * @returns {ExportWorld | null} null on any error
   */
  public static applyMigrationsToWorld(exportWorld: ExportWorld): ExportWorld | null {

    for (let i = 0; i < this.allMigrations.length; i++) {
      const migration = this.allMigrations[i]

      if (migration.oldVersion === exportWorld.editorVersion) {

        try {
          exportWorld = migration.migrateWorld(exportWorld)
          Logger.log(`migrated export world from version ${migration.oldVersion} to ${migration.newVersion}`)

          if (migration.warningMsg) {
            Logger.log(`Migration version ${migration.oldVersion} to ${migration.newVersion}, msg: ${migration.warningMsg}`)
            // DialogHelper.okDialog(`Migration version ${migration.oldVersion} to ${migration.newVersion}`, migration.warningMsg)
          }
        } catch (err) {
          Logger.fatal(`migrating export world failed from version ${migration.oldVersion} to ${migration.newVersion}`)
          return null
        }
      }
    }

    if (exportWorld.editorVersion !== appProperties.version) {
      Logger.fatal(`we missed some migrations... up migrated version is ${exportWorld.editorVersion} editor version is ${appProperties.version}`)
    }

    return exportWorld
  }

}

