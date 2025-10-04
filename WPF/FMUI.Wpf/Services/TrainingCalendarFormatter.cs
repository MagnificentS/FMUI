using System;
using System.Collections.Generic;
using System.Linq;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.Services;

internal static class TrainingCalendarFormatter
{
    private static readonly string[] DaySequence =
    {
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    };

    private static readonly Dictionary<string, int> DayIndex = DaySequence
        .Select((day, index) => (day, index))
        .ToDictionary(pair => pair.day, pair => pair.index, StringComparer.OrdinalIgnoreCase);

    private static readonly string[] SlotSequence =
    {
        "Morning",
        "Afternoon",
        "Evening"
    };

    private static readonly Dictionary<string, int> SlotIndex = SlotSequence
        .Select((slot, index) => (slot, index))
        .ToDictionary(pair => pair.slot, pair => pair.index, StringComparer.OrdinalIgnoreCase);

    private static readonly IReadOnlyList<string> OrderedDaysCache = Array.AsReadOnly(DaySequence);

    private static readonly IReadOnlyList<string> OrderedSlotsCache = Array.AsReadOnly(SlotSequence);

    public static IReadOnlyList<string> OrderedDays => OrderedDaysCache;

    public static IReadOnlyList<string> OrderedSlots => OrderedSlotsCache;

    public static IReadOnlyList<TrainingSessionDetailSnapshot> OrderSessions(IReadOnlyList<TrainingSessionDetailSnapshot> sessions)
    {
        if (sessions is null || sessions.Count == 0)
        {
            return Array.Empty<TrainingSessionDetailSnapshot>();
        }

        return sessions
            .OrderBy(session => GetDayIndex(session.Day))
            .ThenBy(session => GetSlotIndex(session.Slot))
            .ToList();
    }

    public static IReadOnlyList<ListEntrySnapshot> BuildWeekOverview(IReadOnlyList<TrainingSessionDetailSnapshot> sessions)
    {
        var orderedSessions = OrderSessions(sessions);
        if (orderedSessions.Count == 0)
        {
            return Array.Empty<ListEntrySnapshot>();
        }

        var groups = orderedSessions
            .GroupBy(session => NormalizeDay(session.Day))
            .OrderBy(group => GetDayIndex(group.Key))
            .ToList();

        var overview = new List<ListEntrySnapshot>(groups.Count);
        foreach (var group in groups)
        {
            var entries = group
                .OrderBy(session => GetSlotIndex(session.Slot))
                .ToList();

            var secondary = entries[0].Activity;
            var tertiarySegments = new List<string>(entries.Count);

            foreach (var entry in entries)
            {
                var focus = string.IsNullOrWhiteSpace(entry.Focus) ? null : entry.Focus;
                var intensity = string.IsNullOrWhiteSpace(entry.Intensity) ? null : entry.Intensity;

                var detailParts = new List<string>(3) { entry.Slot };
                detailParts.Add(entry.Activity);

                if (focus is not null)
                {
                    detailParts.Add(focus);
                }

                if (intensity is not null)
                {
                    detailParts.Add(intensity);
                }

                tertiarySegments.Add(string.Join(" – ", detailParts));
            }

            var tertiary = tertiarySegments.Count > 0
                ? string.Join(" • ", tertiarySegments)
                : null;

            overview.Add(new ListEntrySnapshot(group.Key, secondary, tertiary));
        }

        return overview;
    }

    public static IReadOnlyList<CardListItem> BuildWeekOverviewCardItems(IReadOnlyList<TrainingSessionDetailSnapshot> sessions)
    {
        var overview = BuildWeekOverview(sessions);
        if (overview.Count == 0)
        {
            return Array.Empty<CardListItem>();
        }

        return overview.Select(entry => new CardListItem(entry.Primary, entry.Secondary, entry.Tertiary, entry.Accent)).ToList();
    }

    private static int GetDayIndex(string? day)
    {
        if (day is null)
        {
            return DaySequence.Length;
        }

        return DayIndex.TryGetValue(day, out var index) ? index : DaySequence.Length;
    }

    private static int GetSlotIndex(string? slot)
    {
        if (slot is null)
        {
            return SlotSequence.Length;
        }

        return SlotIndex.TryGetValue(slot, out var index) ? index : SlotSequence.Length;
    }

    private static string NormalizeDay(string day)
    {
        if (string.IsNullOrWhiteSpace(day))
        {
            return "Unscheduled";
        }

        return DaySequence.FirstOrDefault(candidate => string.Equals(candidate, day, StringComparison.OrdinalIgnoreCase))
            ?? day;
    }
}
