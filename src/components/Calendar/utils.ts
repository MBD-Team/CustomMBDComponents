import { DateTime, Info } from "luxon";
import { computed, Ref } from "vue";
import { Group } from "./types";

export function weekViewScrollbarSize() {
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 1 : 17);
}

export function useGetDayClasses(): (date: number) => { 'is-weekend': boolean };
export function useGetDayClasses(currentDay: Ref<DateTime>): (date: DateTime, type: 'num' | 'day') => Record<'is-weekend' | 'is-today' | 'is-current', boolean>;
export function useGetDayClasses(currentDay?: Ref<DateTime>) {
    if (currentDay)
        return (date: DateTime, type: 'num' | 'day') => ({
            'is-weekend': date.weekday == 6 || date.weekday == 7,
            'is-today': date.startOf('day').equals(DateTime.now().startOf('day')) && type == 'num',
            'is-current': date.startOf('day').equals(currentDay.value.startOf('day')) && type == 'num',
        }) as Record<string, boolean>;

    return (date: number) => ({
        'is-weekend': date == 6 || date == 7
    }) as Record<string, boolean>;
};

export function useGroupColors(groups: Ref<Group[]>) {
    return computed(() => {
        const genRndColor = (i: number) => [50, 25, 80].flatMap(l => [
            `hsl(0, 100%, ${l}%)`,
            `hsl(127, 80%, ${l}%)`,
            `hsl(241, 100%, ${l}%)`,
            `hsl(35, 100%, ${l}%)`,
            `hsl(181, 100%, ${l}%)`,
            `hsl(300, 100%, ${l}%)`,
            `hsl(58, 80%, ${l}%)`,
        ])[i] || '#' + ('000000' + Math.floor((Math.sin(i - 20) * 10000 - Math.floor(Math.sin(i - 20) * 10000)) * 0xffffff).toString(16)).slice(-6);

        let rndColorIndex = 0;
        return groups.value.map(g => g.color || genRndColor(rndColorIndex++));
    });
}

export const isMobile = window.innerWidth < 576;

export function splitConnectedGroups<T>(events: T[], isConnected: (a: T, b: T) => boolean) {
    let groups: T[][] = [];
    for (let event of events) {
        //find groups where it overlaps in
        let groupsCollisions = groups.filter(group => group.some(e => isConnected(e, event)));

        //if we found at least one combine the groups and push it there, else create new group
        if (groupsCollisions.length > 0) {
            let newGroup = [...groupsCollisions.flat(), event];

            for (let group of groupsCollisions) group.splice(0, group.length);

            groupsCollisions[0].splice(0, groupsCollisions.length, ...newGroup);
        } else groups.push([event]);
    }
    return groups.filter(g => g.length > 0);
}