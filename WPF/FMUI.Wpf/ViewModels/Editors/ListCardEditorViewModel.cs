using System;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Input;
using FMUI.Wpf.Infrastructure;
using FMUI.Wpf.Models;

namespace FMUI.Wpf.ViewModels.Editors;

public sealed class ListCardEditorViewModel : CardEditorViewModel
{
    private readonly Func<IReadOnlyList<ListEntrySnapshot>, Task> _persistAsync;
    private readonly RelayCommand _removeSelectedCommand;
    private readonly RelayCommand _moveUpCommand;
    private readonly RelayCommand _moveDownCommand;
    private EditableListItemViewModel? _selectedItem;

    public ListCardEditorViewModel(
        string title,
        string? subtitle,
        IReadOnlyList<ListEntrySnapshot> items,
        Func<IReadOnlyList<ListEntrySnapshot>, Task> persistAsync)
        : base(title, subtitle)
    {
        _persistAsync = persistAsync ?? throw new ArgumentNullException(nameof(persistAsync));
        Items = new ObservableCollection<EditableListItemViewModel>(
            items?.Select(EditableListItemViewModel.FromSnapshot) ?? Enumerable.Empty<EditableListItemViewModel>());
        Items.CollectionChanged += OnItemsCollectionChanged;

        foreach (var item in Items)
        {
            item.PropertyChanged += OnItemPropertyChanged;
        }

        _removeSelectedCommand = new RelayCommand(_ => RemoveSelected(), _ => SelectedItem is not null);
        _moveUpCommand = new RelayCommand(_ => MoveSelected(-1), _ => CanMove(-1));
        _moveDownCommand = new RelayCommand(_ => MoveSelected(1), _ => CanMove(1));
        AddItemCommand = new RelayCommand(_ => AddItem());

        if (Items.Count > 0)
        {
            SelectedItem = Items[0];
        }

        NotifyCanSaveChanged();
    }

    public ObservableCollection<EditableListItemViewModel> Items { get; }

    public EditableListItemViewModel? SelectedItem
    {
        get => _selectedItem;
        set
        {
            if (SetProperty(ref _selectedItem, value))
            {
                _removeSelectedCommand.RaiseCanExecuteChanged();
                _moveUpCommand.RaiseCanExecuteChanged();
                _moveDownCommand.RaiseCanExecuteChanged();
            }
        }
    }

    public ICommand AddItemCommand { get; }

    public ICommand RemoveSelectedCommand => _removeSelectedCommand;

    public ICommand MoveUpCommand => _moveUpCommand;

    public ICommand MoveDownCommand => _moveDownCommand;

    protected override bool CanSave => Items.Count > 0 && Items.All(item => !string.IsNullOrWhiteSpace(item.Primary));

    protected override async Task PersistAsync()
    {
        var snapshot = Items
            .Where(item => !string.IsNullOrWhiteSpace(item.Primary))
            .Select(item => item.ToSnapshot())
            .ToList();

        await _persistAsync(snapshot).ConfigureAwait(false);
    }

    private void AddItem()
    {
        var item = new EditableListItemViewModel(string.Empty, string.Empty, string.Empty, string.Empty);
        item.PropertyChanged += OnItemPropertyChanged;
        Items.Add(item);
        SelectedItem = item;
        NotifyCanSaveChanged();
    }

    private void RemoveSelected()
    {
        var item = SelectedItem;
        if (item is null)
        {
            return;
        }

        item.PropertyChanged -= OnItemPropertyChanged;
        Items.Remove(item);
        if (Items.Count > 0)
        {
            var index = Math.Min(Items.Count - 1, Items.IndexOf(item));
            SelectedItem = Items[Math.Max(0, index)];
        }
        else
        {
            SelectedItem = null;
        }

        NotifyCanSaveChanged();
    }

    private bool CanMove(int direction)
    {
        if (SelectedItem is null)
        {
            return false;
        }

        var index = Items.IndexOf(SelectedItem);
        if (index < 0)
        {
            return false;
        }

        var target = index + direction;
        return target >= 0 && target < Items.Count;
    }

    private void MoveSelected(int direction)
    {
        if (SelectedItem is null)
        {
            return;
        }

        var index = Items.IndexOf(SelectedItem);
        var target = index + direction;
        if (index < 0 || target < 0 || target >= Items.Count)
        {
            return;
        }

        Items.Move(index, target);
        SelectedItem = Items[target];
        NotifyCanSaveChanged();
    }

    private void OnItemsCollectionChanged(object? sender, NotifyCollectionChangedEventArgs e)
    {
        if (e.OldItems is not null)
        {
            foreach (EditableListItemViewModel oldItem in e.OldItems)
            {
                oldItem.PropertyChanged -= OnItemPropertyChanged;
            }
        }

        if (e.NewItems is not null)
        {
            foreach (EditableListItemViewModel newItem in e.NewItems)
            {
                newItem.PropertyChanged += OnItemPropertyChanged;
            }
        }

        NotifyCanSaveChanged();
    }

    private void OnItemPropertyChanged(object? sender, System.ComponentModel.PropertyChangedEventArgs e)
    {
        NotifyCanSaveChanged();
    }
}

public sealed class EditableListItemViewModel : ObservableObject
{
    private string _primary;
    private string? _secondary;
    private string? _tertiary;
    private string? _accent;

    public EditableListItemViewModel(string primary, string? secondary, string? tertiary, string? accent)
    {
        _primary = primary;
        _secondary = secondary;
        _tertiary = tertiary;
        _accent = accent;
    }

    public string Primary
    {
        get => _primary;
        set => SetProperty(ref _primary, value);
    }

    public string? Secondary
    {
        get => _secondary;
        set => SetProperty(ref _secondary, value);
    }

    public string? Tertiary
    {
        get => _tertiary;
        set => SetProperty(ref _tertiary, value);
    }

    public string? Accent
    {
        get => _accent;
        set => SetProperty(ref _accent, value);
    }

    public static EditableListItemViewModel FromSnapshot(ListEntrySnapshot snapshot)
    {
        return new EditableListItemViewModel(snapshot.Primary, snapshot.Secondary, snapshot.Tertiary, snapshot.Accent);
    }

    public ListEntrySnapshot ToSnapshot()
    {
        return new ListEntrySnapshot(
            Primary.Trim(),
            string.IsNullOrWhiteSpace(Secondary) ? null : Secondary.Trim(),
            string.IsNullOrWhiteSpace(Tertiary) ? null : Tertiary.Trim(),
            string.IsNullOrWhiteSpace(Accent) ? null : Accent.Trim());
    }
}
