# Animation Recovery Plan - Globe & ContentCard Only

## What's Actually Broken

### ✅ WORKING (Don't Touch)
- **Planet Map System** - All animations working correctly
- **Multi-Globe Framework** - Navigation, configs, state management
- **Utilities** - Grid calculations, collision detection, rotation helpers
- **System Architecture** - GlobeSystem, view routing, navigation

### ❌ BROKEN (Need to Fix)
- **Globe Component Animations** - Entry animations broken in globesite version
- **ContentCard Animations** - Fly-in/fly-out broken in globesite version

---

## The Core Problem

When you click a planet on the map and navigate to a globe view:
1. The Globe component's entry animation is broken
2. The ContentCard animations are broken
3. Everything else (planet map, navigation, framework) works fine

**Root Cause:** The `globesite/src/components/Globe.jsx` and `globesite/src/components/ContentCard.*` were modified and broke the animations. The main project versions in `src/components/` still have working animations.

---

## The Solution

### Strategy: Copy Working Animations Back

**Don't reinvent the wheel. Just use what works.**

Copy the working animation components from `src/` to `globesite/src/` and make minimal adjustments for the multi-globe system.

---

## Step-by-Step Recovery Plan

### Phase 1: Backup Current State (5 min)

Just to be safe, even though we probably have git:

```bash
cp -r globesite globesite-backup-$(date +%Y%m%d)
```

### Phase 2: Restore Working Globe Component (30 min)

**Goal:** Replace broken Globe with working one

1. **Compare the files:**
   - `src/components/Globe.jsx` (working)
   - `globesite/src/components/Globe.jsx` (broken)

2. **Identify the differences:**
   - The globesite version added `scale` and `subdivision` props
   - These props are actually useful for multi-globe
   - But the animation logic got messed up

3. **Fix approach:**
   - Copy `src/components/Globe.jsx` → `globesite/src/components/Globe.jsx`
   - Keep the `scale` and `subdivision` props from globesite version
   - Test that animations work again

**Specific changes needed in Globe.jsx:**

```javascript
// Keep this from globesite version:
function GlobeComponent({ rotation, targetRotation, scale = 1, subdivision = 2 }) {

// And this:
const geo = new THREE.IcosahedronGeometry(2.5, subdivision)

// And this:
return (
  <group ref={groupRef} scale={scale}>
```

Everything else should be from the working `src/` version.

### Phase 3: Restore Working ContentCard (30 min)

**Goal:** Replace broken ContentCard with working one

1. **Compare the files:**
   - `src/components/ContentCard.jsx` (working)
   - `globesite/src/components/ContentCard.jsx` (probably the same)
   - `src/components/ContentCard.css` (working - position: absolute)
   - `globesite/src/components/ContentCard.css` (broken - position: fixed)

2. **Fix approach:**
   - Copy both .jsx and .css from `src/` to `globesite/src/`
   - The key fix is reverting `position: fixed` back to `position: absolute`

**Critical CSS fix:**

```css
.content-card {
  position: absolute;  /* NOT fixed */
  /* ... rest stays the same */
}
```

### Phase 4: Test Integration (1 hour)

**Goal:** Verify everything works together

1. **Test planet map:**
   - Load the app
   - Verify planet map shows correctly
   - Verify planets animate in correctly
   - Verify click on planet works

2. **Test globe view:**
   - Click a planet
   - Verify globe appears with correct animation
   - Verify globe rotates correctly
   - Verify no weird positioning issues

3. **Test card animations:**
   - Verify first card flies in correctly
   - Scroll to next card
   - Verify fly-out animation works
   - Verify fly-in animation works
   - Test all 4 directions (up/down/left/right)

4. **Test navigation:**
   - Go back to planet map
   - Select different planet
   - Verify transitions smooth
   - Test all globe sizes (tiny, small, medium, large)

### Phase 5: Fix Any Integration Issues (1-2 hours)

**Potential issues and fixes:**

**Issue 1: Globe scale not working**
- Check that GlobeContainer passes `scale` prop correctly
- Check sizeSpec is being used

**Issue 2: Camera distance wrong for different globe sizes**
- Verify GlobeContainer uses `sizeSpec.cameraDistance`
- Check that Canvas camera position updates

**Issue 3: Cards positioned wrong**
- Double-check position: absolute in CSS
- Verify z-index is correct
- Check that parent container has position: relative if needed

**Issue 4: Animations timing off between views**
- May need to adjust transition delays in GlobeSystem
- Check that view transitions don't interrupt card animations

---

## File Comparison Checklist

### Globe.jsx Differences

**Working version (`src/components/Globe.jsx`):**
- ✅ Entry animation works
- ❌ No scale prop
- ❌ No subdivision prop
- ❌ Hardcoded subdivision = 2

**Broken version (`globesite/src/components/Globe.jsx`):**
- ❌ Entry animation broken somehow
- ✅ Has scale prop
- ✅ Has subdivision prop
- ✅ Supports different globe sizes

**What to do:**
- Start with working version
- Add scale and subdivision props
- Test that entry animation still works

### ContentCard.css Differences

**Working version (`src/components/ContentCard.css`):**
- ✅ `position: absolute` (line 8)
- ✅ All animations work

**Broken version (`globesite/src/components/ContentCard.css`):**
- ❌ `position: fixed` (line 8)
- ❌ Cards positioned wrong

**What to do:**
- Just copy the working version over
- That's it

---

## Testing Script

After fixes, run through this test:

### Test 1: Planet Map
- [ ] App loads
- [ ] Planet map shows
- [ ] All planets visible
- [ ] Planets animate in (whatever animation globesite uses)
- [ ] Can click planets

### Test 2: Tiny Globe (Home Planet)
- [ ] Click home planet
- [ ] Globe appears with bounce animation
- [ ] Card flies in from bottom
- [ ] Scroll triggers transition to planet map (special behavior)

### Test 3: Small Globe (2x2)
- [ ] Click skills planet
- [ ] Globe appears correctly
- [ ] First card shows
- [ ] Can scroll to 4 cards total
- [ ] All fly animations work
- [ ] Can navigate back to map

### Test 4: Medium Globe (3x3)
- [ ] Click projects planet
- [ ] Globe appears correctly
- [ ] Can scroll through 9 cards
- [ ] All directions work (up/down/left/right)
- [ ] Wrap-around works if enabled

### Test 5: Large Globe (4x4)
- [ ] Click portfolio planet
- [ ] Globe appears correctly
- [ ] Can scroll through 16 cards
- [ ] All animations smooth
- [ ] No lag or glitches

### Test 6: Navigation Flow
- [ ] HOME → MAP → GLOBE → MAP → HOME
- [ ] MAP → GLOBE A → MAP → GLOBE B
- [ ] Rapid clicking doesn't break anything
- [ ] Back button works
- [ ] No console errors

---

## Exact File Operations

### Step 1: Restore Globe.jsx

```bash
# Read both versions
cat src/components/Globe.jsx > /tmp/working-globe.jsx
cat globesite/src/components/Globe.jsx > /tmp/broken-globe.jsx

# Manually merge: take working version, add scale/subdivision props
# Copy working version as base
cp src/components/Globe.jsx globesite/src/components/Globe.jsx
```

Then manually edit `globesite/src/components/Globe.jsx`:

**Line 5:** Change to:
```javascript
function GlobeComponent({ rotation, targetRotation, scale = 1, subdivision = 2 }) {
```

**Line 19:** Change to:
```javascript
const geo = new THREE.IcosahedronGeometry(2.5, subdivision)
```

**Line 137:** Change to:
```javascript
return (
  <group ref={groupRef} scale={scale}>
```

### Step 2: Restore ContentCard files

```bash
# Just copy both files over
cp src/components/ContentCard.jsx globesite/src/components/ContentCard.jsx
cp src/components/ContentCard.css globesite/src/components/ContentCard.css
```

Done. That's it.

### Step 3: Test

```bash
cd globesite
npm run dev
```

Open browser, test everything.

---

## What If It Still Doesn't Work?

### Debug Checklist

**Issue: Globe doesn't appear**
- Check console for errors
- Check that Globe component is imported correctly in GlobeContainer
- Check that Canvas is rendering
- Check camera position

**Issue: Globe appears but no animation**
- Check that entryAnimation state is working
- Check that groupRef.current exists
- Check useFrame is running
- Add console.log to verify animation progress

**Issue: Cards don't appear**
- Check console for errors
- Check that ContentCard is imported correctly
- Check z-index values
- Check that parent container exists

**Issue: Card animations don't work**
- Check that CSS file is imported
- Check that animation classes are being applied
- Check browser dev tools to see if animations running
- Check that animationDirection state is updating

**Issue: Scrolling doesn't work**
- Check that wheel event listener is attached
- Check that handleWheel function is being called
- Check that neighbors calculation works
- Check that navigation callbacks fire

---

## Timeline

| Task | Time | Cumulative |
|------|------|------------|
| Backup current state | 5 min | 5 min |
| Compare Globe files | 15 min | 20 min |
| Restore Globe.jsx with props | 15 min | 35 min |
| Test Globe animations | 10 min | 45 min |
| Copy ContentCard files | 5 min | 50 min |
| Test card animations | 10 min | 60 min |
| Full integration testing | 30 min | 90 min |
| Fix any issues found | 30-60 min | 2-2.5 hours |

**Total: 2-2.5 hours**

---

## Success Criteria

### Minimum Success (Required)
- [ ] Planet map works (already does)
- [ ] Can navigate to any globe
- [ ] Globe appears with correct animation
- [ ] Cards fly in/out correctly
- [ ] Can scroll through all cards
- [ ] Can navigate back to map
- [ ] No console errors

### Full Success (Ideal)
- [ ] All above passing
- [ ] Smooth transitions between all views
- [ ] All 4 globe sizes work perfectly
- [ ] No visual glitches
- [ ] Performance is good (60fps)

---

## Key Insights

### What Went Wrong
1. Someone changed `position: absolute` to `position: fixed` in ContentCard.css
2. Someone modified the Globe.jsx entry animation and broke it
3. These were likely attempts to fix other issues that created new problems

### Why This Plan Works
1. We're not changing what works (planet map, framework)
2. We're only fixing what's broken (Globe and ContentCard animations)
3. We're using proven working code from `src/`
4. We're making minimal changes (just add scale/subdivision props)

### What Not To Do
- ❌ Don't rewrite animations from scratch
- ❌ Don't change the planet map
- ❌ Don't modify the multi-globe framework
- ❌ Don't try to "improve" animations that work
- ❌ Don't add new features during this fix

---

## Next Steps

1. **Do the file comparison** - Look at Globe.jsx differences
2. **Restore Globe.jsx** - Copy working version, add scale/subdivision
3. **Restore ContentCard files** - Just copy both files over
4. **Test immediately** - See if it works
5. **Fix integration issues** - Only if needed
6. **Done** - Move on with your life

The fix is simple. Don't overthink it.
