using System;
using System.IO;
using System.IO.MemoryMappedFiles;
using System.Runtime.CompilerServices;
using System.Text;

namespace FMUI.Wpf.Infrastructure
{
    public sealed unsafe class StringTable : IDisposable
    {
        private readonly string[] _cache;
        private readonly MemoryMappedFile _memoryMappedFile;
        private readonly MemoryMappedViewAccessor _viewAccessor;
        private readonly byte* _basePointer;
        private bool _disposed;

        public StringTable(string binaryPath)
        {
            if (!File.Exists(binaryPath))
            {
                throw new FileNotFoundException("StringTable binary file not found.", binaryPath);
            }

            _memoryMappedFile = MemoryMappedFile.CreateFromFile(binaryPath, FileMode.Open, null, 0, MemoryMappedFileAccess.Read);
            _viewAccessor = _memoryMappedFile.CreateViewAccessor(0, 0, MemoryMappedFileAccess.Read);

            byte* pointer = null;
            _viewAccessor.SafeMemoryMappedViewHandle.AcquirePointer(ref pointer);
            _basePointer = pointer;

            int count = *(int*)_basePointer;
            _cache = new string[count];

            int* offsets = (int*)(_basePointer + sizeof(int));
            ushort* lengths = (ushort*)(_basePointer + sizeof(int) + (count * sizeof(int)));
            byte* data = (byte*)(_basePointer + sizeof(int) + (count * sizeof(int)) + (count * sizeof(ushort)));

            for (int i = 0; i < count; i++)
            {
                _cache[i] = Encoding.UTF8.GetString(data + offsets[i], lengths[i]);
            }
        }

        public int Count => _cache.Length;

        [MethodImpl(MethodImplOptions.AggressiveInlining)]
        public string GetString(ushort id)
        {
            return _cache[id];
        }

        public void Dispose()
        {
            if (_disposed)
            {
                return;
            }

            _disposed = true;
            _viewAccessor.SafeMemoryMappedViewHandle.ReleasePointer();
            _viewAccessor.Dispose();
            _memoryMappedFile.Dispose();
        }
    }
}

