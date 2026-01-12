# 📝 CHANGELOG

## [7.0] - 2026-01-11

### 🎉 Major Refactor: Complete ESM Modularization

#### Architecture
- **BREAKING**: Converted from monolithic script.js to 10+ independent ESM modules
- Implemented single entry point (script.js) with clean imports
- 100% event listener based (removed all onclick handlers)
- Zero external dependencies maintained

#### Modules Created
- `state.js` - Central state management
- `calculations.js` - Core calculation logic
- `canvas.js` - Visual rendering
- `storage.js` - localStorage CRUD
- `gabinetes.js` - Cabinet data model
- `gabinete-system.js` - Cabinet management system
- `screens.js` - Screen list UI and management
- `ui.js` - Input bindings and navigation
- `theme.js` - Dark/light theme management
- `reports.js` - PDF report generation

#### Code Quality
- Removed 8+ console.log statements (debug cleanup)
- Optimized imports (reduced unused imports by 11)
- Eliminated code duplication in event handlers
- Extracted hardcoded function handlers to event delegation

#### Features Maintained
- ✅ Multi-screen projects
- ✅ 4 calculation modes (Manual, H, V, Best)
- ✅ Z-Type and U-Type cabling
- ✅ Cabinet database with full CRUD
- ✅ Physical stats (weight, power, amperes)
- ✅ PDF report generation
- ✅ Dark/light theme toggle
- ✅ LocalStorage persistence

#### Browser Compatibility
- ✅ Chrome/Edge 91+
- ✅ Firefox 89+
- ✅ Safari 15+
- (ES6 modules required)

#### Performance Improvements
- Smaller bundle (modular code, better tree-shaking)
- Faster load time (parallel module evaluation)
- Better DevTools debugging (named functions)
- Cleaner global namespace

---

## [6.2] - 2025-11-20

### Features
- Initial release with monolithic architecture
- Multi-screen support
- Cabinet database
- 4 calculation modes
- Cabling visualization
- PDF reports
- Dark/light themes

---

## Version History

| Version | Date | Status | Type |
|---------|------|--------|------|
| 7.0 | 2026-01-11 | Latest | Major Refactor |
| 6.2 | 2025-11-20 | Archived | Initial |

---

## Migration Guide (6.2 → 7.0)

### For Users
✅ **No changes required** - Interface and features remain identical

### For Developers
See `DOCUMENTATION_GUIDE.md` for:
- New module structure
- How to extend functionality
- Event listener patterns
- State management

**Key Change**: All features now properly separated into modules. Want to modify calculations? Edit `js/modules/calculations.js` instead of a 1000-line script.js!

---

**Questions?** Check DOCUMENTATION_GUIDE.md for detailed architecture overview.
