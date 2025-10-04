using System;
using System.Threading.Tasks;
using System.Windows.Input;
using FMUI.Wpf.Infrastructure;

namespace FMUI.Wpf.ViewModels.Editors;

public abstract class CardEditorViewModel : ObservableObject
{
    private readonly AsyncRelayCommand _saveCommand;
    private readonly RelayCommand _cancelCommand;
    private bool _isBusy;

    protected CardEditorViewModel(string title, string? subtitle = null)
    {
        Title = title ?? throw new ArgumentNullException(nameof(title));
        Subtitle = subtitle;
        _saveCommand = new AsyncRelayCommand(SaveAsync, () => CanSave);
        _cancelCommand = new RelayCommand(_ => RequestClose());
    }

    public string Title { get; }

    public string? Subtitle { get; }

    public bool HasSubtitle => !string.IsNullOrWhiteSpace(Subtitle);

    public bool IsBusy
    {
        get => _isBusy;
        private set => SetProperty(ref _isBusy, value);
    }

    public ICommand SaveCommand => _saveCommand;

    public ICommand CancelCommand => _cancelCommand;

    protected virtual bool CanSave => true;

    public event EventHandler? CloseRequested;

    protected void NotifyCanSaveChanged() => _saveCommand.RaiseCanExecuteChanged();

    protected void RequestClose() => CloseRequested?.Invoke(this, EventArgs.Empty);

    private async Task SaveAsync()
    {
        if (!CanSave)
        {
            return;
        }

        IsBusy = true;
        try
        {
            await PersistAsync().ConfigureAwait(false);
            RequestClose();
        }
        finally
        {
            IsBusy = false;
        }
    }

    protected abstract Task PersistAsync();
}
