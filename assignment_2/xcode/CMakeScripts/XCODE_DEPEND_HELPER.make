# DO NOT EDIT
# This makefile makes sure all linkable targets are
# up-to-date with anything they link to
default:
	echo "Do not invoke directly"

# Rules to remove targets that are older than anything to which they
# link.  This forces Xcode to relink the targets from scratch.  It
# does not seem to check these dependencies itself.
PostBuild.debug_aabb.Debug:
PostBuild.lodePNG.Debug: /Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/Debug/debug_aabb
/Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/Debug/debug_aabb:\
	/Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/lib/lodePNG/Debug/liblodePNG.a
	/bin/rm -f /Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/Debug/debug_aabb


PostBuild.lodePNG.Debug:
/Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/lib/lodePNG/Debug/liblodePNG.a:
	/bin/rm -f /Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/lib/lodePNG/Debug/liblodePNG.a


PostBuild.raytrace.Debug:
PostBuild.lodePNG.Debug: /Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/Debug/raytrace
/Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/Debug/raytrace:\
	/Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/lib/lodePNG/Debug/liblodePNG.a
	/bin/rm -f /Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/Debug/raytrace


PostBuild.debug_aabb.Release:
PostBuild.lodePNG.Release: /Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/Release/debug_aabb
/Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/Release/debug_aabb:\
	/Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/lib/lodePNG/Release/liblodePNG.a
	/bin/rm -f /Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/Release/debug_aabb


PostBuild.lodePNG.Release:
/Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/lib/lodePNG/Release/liblodePNG.a:
	/bin/rm -f /Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/lib/lodePNG/Release/liblodePNG.a


PostBuild.raytrace.Release:
PostBuild.lodePNG.Release: /Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/Release/raytrace
/Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/Release/raytrace:\
	/Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/lib/lodePNG/Release/liblodePNG.a
	/bin/rm -f /Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/Release/raytrace


PostBuild.debug_aabb.MinSizeRel:
PostBuild.lodePNG.MinSizeRel: /Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/MinSizeRel/debug_aabb
/Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/MinSizeRel/debug_aabb:\
	/Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/lib/lodePNG/MinSizeRel/liblodePNG.a
	/bin/rm -f /Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/MinSizeRel/debug_aabb


PostBuild.lodePNG.MinSizeRel:
/Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/lib/lodePNG/MinSizeRel/liblodePNG.a:
	/bin/rm -f /Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/lib/lodePNG/MinSizeRel/liblodePNG.a


PostBuild.raytrace.MinSizeRel:
PostBuild.lodePNG.MinSizeRel: /Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/MinSizeRel/raytrace
/Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/MinSizeRel/raytrace:\
	/Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/lib/lodePNG/MinSizeRel/liblodePNG.a
	/bin/rm -f /Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/MinSizeRel/raytrace


PostBuild.debug_aabb.RelWithDebInfo:
PostBuild.lodePNG.RelWithDebInfo: /Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/RelWithDebInfo/debug_aabb
/Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/RelWithDebInfo/debug_aabb:\
	/Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/lib/lodePNG/RelWithDebInfo/liblodePNG.a
	/bin/rm -f /Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/RelWithDebInfo/debug_aabb


PostBuild.lodePNG.RelWithDebInfo:
/Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/lib/lodePNG/RelWithDebInfo/liblodePNG.a:
	/bin/rm -f /Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/lib/lodePNG/RelWithDebInfo/liblodePNG.a


PostBuild.raytrace.RelWithDebInfo:
PostBuild.lodePNG.RelWithDebInfo: /Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/RelWithDebInfo/raytrace
/Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/RelWithDebInfo/raytrace:\
	/Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/lib/lodePNG/RelWithDebInfo/liblodePNG.a
	/bin/rm -f /Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/RelWithDebInfo/raytrace




# For each target create a dummy ruleso the target does not have to exist
/Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/lib/lodePNG/Debug/liblodePNG.a:
/Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/lib/lodePNG/MinSizeRel/liblodePNG.a:
/Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/lib/lodePNG/RelWithDebInfo/liblodePNG.a:
/Users/bindas/Documents2/EPFL/ComputerGraphics/ComputerGraphics/assignment_2/xcode/lib/lodePNG/Release/liblodePNG.a:
