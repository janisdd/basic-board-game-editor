import {ExportTile, ExportWorld, MajorLineDirection, Tile} from "../types/world";
import {Logger} from "./logger";
import {FieldShape, FieldSymbol, ImgShape, ImgSymbol, LineShape, LineSymbol} from "../types/drawing";
import {appProperties, defaultGameInitCode, defaultTileHeight, defaultTileWidth, getDefaultNewTile} from "../constants";
import {SimulationTimes} from "../../simulation/machine/AbstractMachine";


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
          overwritePadding:true,
          overwriteVerticalTextAlign:true,
          overwriteHorizontalTextAlign:true,
          overwriteHeight:true,
          overwriteWidth:true,
          overwriteColor:true,
          overwriteBgColor:true,
          overwriteBorderColor:true,
          overwriteBorderSizeInPx:true,
          overwriteFontName:true,
          overwriteFontSizeInPx:true,
          overwriteFontDecoration:true,
          overwriteText:true,
          kind: "field"
        }
      }),
      imgSymbols: exportWorld.imgSymbols.map<ImgSymbol>(imgSymbol => {
        return {
          ...imgSymbol,
          overwriteHeight:true,
          overwriteImage:true,
          overwriteIsDisabledForMouseSelection:true,
          overwriteRotationInDeg:true,
          overwriteSkewX:true,
          overwriteSkewY:true,
          overwriteWidth:true,
          kind: "img"
        }
      }),
      lineSymbols: exportWorld.lineSymbols.map<LineSymbol>(lineSymbol => {
        return {
          ...lineSymbol,
          overwriteArrowHeight:true,
          overwriteArrowWidth:true,
          overwriteColor:true,
          overwriteGapsInPx:true,
          overwriteHasEndArrow:true,
          overwriteHasStartArrow:true,
          overwriteThicknessInPx:true,
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
  ]

  /**
   * applies all pending migrations to the tile
   * the returned tile version is the latest version
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
        } catch (err) {
          Logger.fatal(`migrating export tile failed from version ${migration.oldVersion} to ${migration.newVersion}`)
          return null
        }
      }
      else {


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