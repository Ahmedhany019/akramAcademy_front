import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, GraduationCap } from "lucide-react";
import { useGetClassesQuery, useGetMeQuery } from "../../redux/api/apiSlice";
import Skeleton from "../common/Skeleton";
import { cn } from "../../utils/cn";

export default function ClassesDropdown({ onItemClick, collapsed = false }) {
  const location = useLocation();
  const isClassesActive = location.pathname.startsWith("/classes");
  const [isOpen, setIsOpen] = useState(isClassesActive);

  const { data: meData } = useGetMeQuery();
  const user = meData?.data?.user || meData?.user || meData?.data || {};
  const studentGradeId = user?.profile?.grade_level || user?.grade_level || user?.profile?.grade_level_id || user?.class_id;

  const { data: classesResponse, isLoading } = useGetClassesQuery();
  const allClasses = classesResponse?.data || classesResponse || [];

  const classes = Array.isArray(allClasses)
    ? user?.role === "admin" || !studentGradeId
      ? allClasses
      : allClasses.filter((c) => String(c.id) === String(studentGradeId))
    : [];

  // Group classes into الثانوية (بكالوريا، أزهر، عام)، الإعدادية، الابتدائية
  const groupClasses = (list) => {
    const thanawyaSubgroups = {
      bakaloria: { title: "بكالوريا", items: [] },
      azhar: { title: "أزهر", items: [] },
      aam: { title: "عام", items: [] },
      other: { title: "أخرى", items: [] },
    };

    const edadyItems = [];
    const ebtedayItems = [];
    const otherItems = [];

    if (Array.isArray(list)) {
      list.forEach((item) => {
        const name = item.name || "";
        if (name.includes("بكالوريا") || name.includes("بكلوريا")) {
          thanawyaSubgroups.bakaloria.items.push(item);
        } else if (name.includes("ازهر") || name.includes("أزهر")) {
          thanawyaSubgroups.azhar.items.push(item);
        } else if (name.includes("عام") || name.includes("العام") || name.includes("ثانوي") || name.includes("الثانوي")) {
          thanawyaSubgroups.aam.items.push(item);
        } else if (name.includes("إعدادي") || name.includes("اعدادي")) {
          edadyItems.push(item);
        } else if (name.includes("ابتدائي") || name.includes("الابتدائي")) {
          ebtedayItems.push(item);
        } else {
          otherItems.push(item);
        }
      });
    }

    const groups = [];

    const activeThanawyaSubs = Object.values(thanawyaSubgroups).filter(
      (sub) => sub.items.length > 0
    );

    if (activeThanawyaSubs.length > 0) {
      groups.push({
        title: "الثانوي",
        hasSubgroups: true,
        subgroups: activeThanawyaSubs,
      });
    }

    if (edadyItems.length > 0) {
      groups.push({
        title: "الإعدادي",
        hasSubgroups: false,
        items: edadyItems,
      });
    }

    if (ebtedayItems.length > 0) {
      groups.push({
        title: "الابتدائي",
        hasSubgroups: false,
        items: ebtedayItems,
      });
    }

    if (otherItems.length > 0) {
      groups.push({
        title: "صفوف أخرى",
        hasSubgroups: false,
        items: otherItems,
      });
    }

    return groups;
  };

  const grouped = groupClasses(classes);

  // Track expanded state for each stage category and subgroup
  const [openStages, setOpenStages] = useState(() => ({
    الثانوي: false,
    الإعدادي: false,
    الابتدائي: false,
    بكالوريا: false,
    أزهر: false,
    عام: false,
  }));

  const toggleStage = (stageTitle) => {
    setOpenStages((prev) => ({
      ...prev,
      [stageTitle]: !prev[stageTitle],
    }));
  };

  return (
    <div className="w-full relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title={collapsed ? "الصفوف الدراسية" : ""}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-gray-300 hover:text-white hover:bg-white/5",
          collapsed && "justify-center px-0",
          (isOpen || isClassesActive) && "text-white bg-white/5"
        )}
      >
        <div className="flex items-center gap-3">
          <GraduationCap
            className={cn(
              "w-5 h-5 transition-colors flex-shrink-0",
              isClassesActive ? "text-cyanAccent" : "text-gray-400"
            )}
          />
          {!collapsed && <span className="truncate">الصفوف الدراسية</span>}
        </div>
        {!collapsed && (
          <ChevronDown
            className={cn(
              "w-4 h-4 text-gray-400 transition-transform duration-300",
              isOpen && "rotate-180 text-cyanAccent"
            )}
          />
        )}
      </button>

      {/* Collapsible Container with smooth transition */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out pl-2 pr-2 space-y-2",
          isOpen && !collapsed
            ? "max-h-[1000px] opacity-100 mt-2"
            : "max-h-0 opacity-0 pointer-events-none"
        )}
      >
        {isLoading ? (
          <div className="space-y-2 py-2">
            <Skeleton className="h-6 w-full bg-white/10" />
            <Skeleton className="h-6 w-3/4 bg-white/10" />
            <Skeleton className="h-6 w-4/5 bg-white/10" />
          </div>
        ) : grouped.length > 0 ? (
          grouped.map((group, gIdx) => {
            const isStageOpen = openStages[group.title] ?? true;
            return (
              <div key={gIdx} className="space-y-1">
                {/* Stage Header Button / Dropdown Toggle */}
                <button
                  type="button"
                  onClick={() => toggleStage(group.title)}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-bold text-gray-400 hover:text-cyanAccent hover:bg-white/5 transition-all duration-200 uppercase tracking-wider"
                >
                  <span>{group.title}</span>
                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 transition-transform duration-300 text-gray-400",
                      isStageOpen && "rotate-180 text-cyanAccent"
                    )}
                  />
                </button>

                {/* Sub-classes Collapsible */}
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out border-r border-cyanAccent/20 mr-2 pr-2 space-y-1",
                    isStageOpen
                      ? "max-h-[1000px] opacity-100 py-1"
                      : "max-h-0 opacity-0 pointer-events-none py-0"
                  )}
                >
                  {group.hasSubgroups ? (
                    group.subgroups.map((sub, sIdx) => {
                      const isSubOpen = openStages[sub.title] ?? true;
                      return (
                        <div key={sIdx} className="space-y-0.5">
                          {/* Subgroup Header Button (بكالوريا / أزهر / عام) */}
                          <button
                            type="button"
                            onClick={() => toggleStage(sub.title)}
                            className="w-full flex items-center justify-between px-2 py-1 rounded-md text-[11px] font-semibold text-cyanAccent/90 hover:text-cyanAccent hover:bg-white/5 transition-all duration-200"
                          >
                            <span>{sub.title}</span>
                            <ChevronDown
                              className={cn(
                                "w-3 h-3 transition-transform duration-300 text-gray-400",
                                isSubOpen && "rotate-180 text-cyanAccent"
                              )}
                            />
                          </button>

                          {/* Nested Classes Links */}
                          <div
                            className={cn(
                              "overflow-hidden transition-all duration-300 ease-in-out border-r border-white/10 mr-2 pr-1.5 space-y-0.5",
                              isSubOpen
                                ? "max-h-[500px] opacity-100 py-0.5"
                                : "max-h-0 opacity-0 pointer-events-none py-0"
                            )}
                          >
                            {sub.items.map((cls) => (
                              <NavLink
                                key={cls.id}
                                to={`/classes/${cls.id}`}
                                onClick={onItemClick}
                                className={({ isActive }) =>
                                  cn(
                                    "block px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                                    isActive
                                      ? "bg-cyanAccent text-white font-bold shadow-xs"
                                      : "text-gray-300 hover:text-white hover:bg-white/10"
                                  )
                                }
                              >
                                {cls.name}
                              </NavLink>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    group.items.map((cls) => (
                      <NavLink
                        key={cls.id}
                        to={`/classes/${cls.id}`}
                        onClick={onItemClick}
                        className={({ isActive }) =>
                          cn(
                            "block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                            isActive
                              ? "bg-cyanAccent text-white font-bold shadow-xs"
                              : "text-gray-300 hover:text-white hover:bg-white/10"
                          )
                        }
                      >
                        {cls.name}
                      </NavLink>
                    ))
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-xs text-gray-400 py-2 pr-3">
            لا توجد صفوف مضافة
          </div>
        )}
      </div>
    </div>
  );
}
