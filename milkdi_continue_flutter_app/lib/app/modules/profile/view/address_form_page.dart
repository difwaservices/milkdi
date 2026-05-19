import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../data/models/food_models.dart';
import '../../../data/services/db_service.dart';
import '../../../core/constants/app_colors.dart';

class AddressFormPage extends StatefulWidget {
  final UserAddress? address;

  const AddressFormPage({super.key, this.address});

  @override
  State<AddressFormPage> createState() => _AddressFormPageState();
}

class _AddressFormPageState extends State<AddressFormPage> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _titleCtrl;
  late TextEditingController _nameCtrl;
  late TextEditingController _emailCtrl;
  late TextEditingController _streetCtrl;
  late TextEditingController _cityCtrl;
  late TextEditingController _stateCtrl;
  late TextEditingController _pincodeCtrl;
  late bool _isDefault;

  @override
  void initState() {
    super.initState();
    _titleCtrl = TextEditingController(text: widget.address?.title ?? '');
    _nameCtrl = TextEditingController(text: widget.address?.fullName ?? '');
    _emailCtrl = TextEditingController(text: widget.address?.email ?? '');
    _streetCtrl = TextEditingController(text: widget.address?.street ?? '');

    // Parse details string back to discrete parts if editing
    String city = '';
    String state = '';
    String pincode = '';
    
    if (widget.address != null) {
      final details = widget.address!.details;
      final parts = details.split(',');
      if (parts.isNotEmpty) {
        city = parts[0].trim();
        if (parts.length > 1) {
          final statePin = parts[1].trim();
          if (statePin.contains(' ')) {
            pincode = statePin.split(' ').last;
            state = statePin.substring(0, statePin.lastIndexOf(' ')).trim();
          } else {
            state = statePin;
          }
        }
      }
    }

    _cityCtrl = TextEditingController(text: city);
    _stateCtrl = TextEditingController(text: state);
    _pincodeCtrl = TextEditingController(text: pincode);
    _isDefault = widget.address?.isDefault ?? false;
  }

  @override
  void dispose() {
    _titleCtrl.dispose();
    _nameCtrl.dispose();
    _emailCtrl.dispose();
    _streetCtrl.dispose();
    _cityCtrl.dispose();
    _stateCtrl.dispose();
    _pincodeCtrl.dispose();
    super.dispose();
  }

  void _save(BuildContext context) {
    if (_formKey.currentState!.validate()) {
      final provider = CartProviderScope.of(context);
      
      // Merge discrete fields into a single details string for UserAddress
      final String details = '${_cityCtrl.text.trim()}, ${_stateCtrl.text.trim()} ${_pincodeCtrl.text.trim()}';

      final newAddress = UserAddress(
        id: widget.address?.id ?? DateTime.now().millisecondsSinceEpoch.toString(),
        title: _titleCtrl.text.trim(),
        fullName: _nameCtrl.text.trim(),
        email: _emailCtrl.text.trim(),
        street: _streetCtrl.text.trim(),
        details: details,
        isDefault: _isDefault,
      );

      if (widget.address == null) {
        provider.addAddress(newAddress);
      } else {
        provider.updateAddress(newAddress);
      }
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F8FA),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        title: Text(
          widget.address == null ? 'Add New Address' : 'Edit Address',
          style: const TextStyle(
            color: Color(0xFF1A1A1A),
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF1A1A1A)),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildField(
                controller: _nameCtrl,
                label: 'Full Name',
                hint: 'John Doe',
                icon: Icons.person_outline,
                validator: (v) => v!.isEmpty ? 'Please enter your name' : null,
              ),
              const SizedBox(height: 16),
              _buildField(
                controller: _emailCtrl,
                label: 'Email Address',
                hint: 'john@example.com',
                icon: Icons.mail_outline,
                keyboardType: TextInputType.emailAddress,
                validator: (v) {
                  if (v!.isEmpty) return 'Please enter email';
                  if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(v)) {
                    return 'Please enter a valid email address';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              _buildField(
                controller: _titleCtrl,
                label: 'Tag (e.g. Home, Office)',
                hint: 'Home',
                icon: Icons.label_outline,
                validator: (v) => v!.isEmpty ? 'Please enter a tag' : null,
              ),
              const SizedBox(height: 16),
              _buildField(
                controller: _streetCtrl,
                label: 'Street / House No.',
                hint: '123 MG Road',
                icon: Icons.map_outlined,
                validator: (v) => v!.isEmpty ? 'Please enter street info' : null,
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: _buildField(
                      controller: _cityCtrl,
                      label: 'City',
                      hint: 'Indore',
                      icon: Icons.location_city_outlined,
                      validator: (v) => v!.isEmpty ? 'Required' : null,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: _buildField(
                      controller: _stateCtrl,
                      label: 'State',
                      hint: 'MP',
                      icon: Icons.map_outlined,
                      validator: (v) => v!.isEmpty ? 'Required' : null,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              _buildField(
                controller: _pincodeCtrl,
                label: 'Pincode',
                hint: '123456',
                icon: Icons.pin_drop_outlined,
                keyboardType: TextInputType.number,
                maxLength: 6,
                inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                validator: (v) {
                  if (v!.isEmpty) return 'Please enter pincode';
                  if (!RegExp(r'^\d{6}$').hasMatch(v)) {
                    return 'Please enter a valid 6-digit pincode';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                   Transform.scale(
                    scale: 0.9,
                    child: Switch(
                      value: _isDefault,
                      onChanged: (v) => setState(() => _isDefault = v),
                      activeThumbColor: AppColors.primary,
                      activeTrackColor: AppColors.primaryLight,
                    ),
                  ),
                  const Text(
                    'Set as default address',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1A1A1A),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 40),
              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: () => _save(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    elevation: 0,
                  ),
                  child: const Text(
                    'Save Address',
                    style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildField({
    required TextEditingController controller,
    required String label,
    required String hint,
    required IconData icon,
    TextInputType? keyboardType,
    int? maxLength,
    List<TextInputFormatter>? inputFormatters,
    String? Function(String?)? validator,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.bold,
            color: Colors.grey.shade700,
          ),
        ),
        const SizedBox(height: 8),
        TextFormField(
          controller: controller,
          validator: validator,
          keyboardType: keyboardType,
          maxLength: maxLength,
          inputFormatters: inputFormatters,
          style: const TextStyle(fontWeight: FontWeight.w500),
          decoration: InputDecoration(
            counterText: '',
            hintText: hint,
            hintStyle: TextStyle(color: Colors.grey.shade400, fontWeight: FontWeight.w400),
            prefixIcon: Icon(icon, size: 22, color: Colors.grey),
            filled: true,
            fillColor: Colors.white,
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: Colors.grey.shade200),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: Colors.grey.shade200),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Colors.redAccent, width: 1),
            ),
          ),
        ),
      ],
    );
  }
}
